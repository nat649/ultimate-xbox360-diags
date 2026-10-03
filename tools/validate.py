#!/usr/bin/env python3
"""Integrity checks for data.js. Run from the repo root: python3 tools/validate.py

Exits non-zero and lists every problem found. No dependencies beyond the standard library."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEVERITIES = {'fatal', 'serious', 'moderate', 'minor'}
DIFFICULTIES = {'DIY', 'advanced', 'pro only'}
TIERS = {'S+', 'S', 'A', 'B', 'C', 'F'}
CHASSIS = {'Phat', 'Slim (S)', 'E'}
TABS = {'decoder', 'troubleshoot', 'codes', 'identify', 'boards', 'ranking', 'softmods', 'models', 'reference', 'consoles'}
YM = re.compile(r'^\d{4}-(0[1-9]|1[0-2])$')


def load():
    src = (ROOT / 'data.js').read_text(encoding='utf-8')
    return json.loads(src[src.index('{'):src.rindex('}') + 1])


def values(code):
    """Every numeric value a code row stands for: '0102' -> [18], 'E64 / E65' -> [64, 65]."""
    m = re.search(r'\b[0-3]{4}\b', code)
    if m:
        return [int(m.group(0), 4)]
    return [int(n) for n in re.findall(r'E\s*(\d{1,3})', code, re.I)]


def main():
    D = load()
    errs = []
    err = errs.append

    # error codes
    seen, by_value = set(), {}
    for e in D['errors']:
        c = e.get('code', '')
        if c in seen:
            err(f'duplicate error code {c!r}')
        seen.add(c)
        for k in ('sys', 'boards', 'fix'):
            if not e.get(k):
                err(f'{c}: missing {k}')
        if e.get('severity') not in SEVERITIES:
            err(f'{c}: severity {e.get("severity")!r} not in {sorted(SEVERITIES)}')
        if e.get('difficulty') not in DIFFICULTIES:
            err(f'{c}: difficulty {e.get("difficulty")!r} not in {sorted(DIFFICULTIES)}')
        vs = values(c)
        if not vs:
            err(f'{c}: code is neither a 4-digit base-4 secondary nor an E-code')
        for v in vs:
            if not 0 <= v <= 255:
                err(f'{c}: value {v} out of range')
            by_value.setdefault(v, []).append(c)

    def resolves(ref):
        return all(v in by_value for v in values(ref)) and values(ref)

    for e in D['errors']:
        for r in e.get('related', []):
            if not resolves(r):
                err(f'{e["code"]}: related {r!r} does not resolve to any row')
            if r == e['code']:
                err(f'{e["code"]}: relates to itself')

    # boards
    slugs = set()
    for m in D['mobos']:
        n = m.get('name')
        if m.get('tier') not in TIERS:
            err(f'board {n}: tier {m.get("tier")!r}')
        if not isinstance(m.get('risk'), (int, float)) or not 0 <= m['risk'] <= 100:
            err(f'board {n}: risk must be 0-100')
        for c in m.get('codes', []):
            if not resolves(c):
                err(f'board {n}: code {c!r} does not resolve')
        ident = m.get('id') or {}
        if not set(ident.get('chassis', [])) <= CHASSIS or not ident.get('chassis'):
            err(f'board {n}: id.chassis must be a non-empty subset of {sorted(CHASSIS)}')
        if not isinstance(ident.get('hdmi'), bool):
            err(f'board {n}: id.hdmi must be true/false')
        if not ident.get('watts'):
            err(f'board {n}: id.watts missing')
        for k in ('dateFrom', 'dateTo'):
            if not YM.match(str(ident.get(k, ''))):
                err(f'board {n}: id.{k} must be YYYY-MM')
        if ident.get('dateFrom', '') > ident.get('dateTo', ''):
            err(f'board {n}: id.dateFrom is after id.dateTo')
        if m.get('slug') in slugs:
            err(f'board {n}: duplicate slug')
        slugs.add(m.get('slug'))

    # troubleshooter
    flows = D.get('flows', {})
    if 'start' not in flows:
        err('flows: no start node')
    reached = set()

    def walk(k):
        if k in reached:
            return
        reached.add(k)
        node = flows.get(k)
        if node is None:
            return
        for o in node.get('options', []):
            if o['next'] not in flows:
                err(f'flows.{k}: option {o["label"]!r} -> missing node {o["next"]!r}')
            walk(o['next'])

    walk('start')
    for k, node in flows.items():
        if k not in reached:
            err(f'flows.{k}: unreachable from start')
        if 'options' not in node and 'result' not in node:
            err(f'flows.{k}: needs either options or a result')

    # every in-app route must point somewhere real
    gslugs = {g['slug'] for g in D.get('glossary', [])}

    def check_route(where, route):
        path = route.split('?')[0]
        tab, _, arg = path.partition('/')
        if tab not in TABS:
            err(f'{where}: route {route!r} has unknown tab {tab!r}')
        elif arg and tab == 'codes' and not resolves(arg):
            err(f'{where}: route {route!r} names an unknown code')
        elif arg and tab == 'boards' and arg not in slugs:
            err(f'{where}: route {route!r} names an unknown board')
        elif arg and tab == 'troubleshoot' and arg not in flows:
            err(f'{where}: route {route!r} names an unknown flow node')
        elif arg and tab == 'reference' and arg not in gslugs:
            err(f'{where}: route {route!r} names an unknown glossary term')

    for k, node in flows.items():
        for l in node.get('links', []):
            check_route(f'flows.{k}', l['route'])
    for p in D.get('primary', []):
        check_route(f'primary {p["title"]!r}', p['route'])
    for t in D.get('timeline', []):
        if not YM.match(t['date']):
            err(f'timeline {t["label"]!r}: date must be YYYY-MM')
        if t.get('board') and t['board'] not in slugs:
            err(f'timeline {t["label"]!r}: unknown board slug {t["board"]!r}')
    if len(gslugs) != len(D.get('glossary', [])):
        err('glossary: duplicate term slugs')

    if errs:
        print(f'{len(errs)} problem(s) in data.js:')
        for e in errs:
            print('  -', e)
        sys.exit(1)
    print(f'data.js OK: {len(D["errors"])} codes, {len(D["mobos"])} boards, '
          f'{len(flows)} troubleshooter nodes, {len(gslugs)} glossary terms')


if __name__ == '__main__':
    main()
