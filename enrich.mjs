/* Adds the extra detail layer (severity, fix difficulty, deeper notes, cross-links,
   board specs / common faults / modding compatibility) on top of the scraped data. */
import fs from 'fs';
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));

/* ---------- error codes ---------- */
const E = {
  '0001': ['serious', 'advanced', 'Short on the 12 V rail. Measure resistance from the 12 V pin to ground with the PSU unplugged: a dead short (under ~1 ohm) means a failed MOSFET or a shorted tantalum cap on the input side. A brick that clicks to red is usually protecting itself, not broken.', ['0002', '0003']],
  '0002': ['serious', 'advanced', 'CPU Vcore rail is pulled down. On Xenon/Zephyr the usual culprits are the CPU-side MOSFETs and the ethernet magnetics chip on the underside, which shorts and drags the same rail with it. Lift the ethernet transformer to isolate before condemning the CPU.', ['0001', 'E73']],
  '0003': ['serious', 'advanced', 'GPU Vcore rail is dead or shorted. Check each phase of the GPU VRM for a blown FET and its gate driver. If the rail is shorted with all FETs removed, the short is inside the GPU package and the board is scrap unless you replace the die.', ['0001', '0020']],
  '0010': ['moderate', 'advanced', 'Southbridge running hot or on cracked joints. The SB has no heatsink on early phats, so a clogged case plus a dry thermal pad is enough. Reflowing buys time; reballing with high-TG solder is the real fix.', ['0021', '0023']],
  '0011': ['minor', 'DIY', 'Pure thermal. Pull the heatsinks, clean off the fossilised factory paste, re-paste with a decent non-conductive compound and confirm both fans spin. If it comes back within minutes, a fan header or the fan itself is dead.', ['0012', '0013']],
  '0012': ['minor', 'DIY', 'Thermal on the GPU side. Check x-clamp tension: a popped clamp lets the heatsink float a fraction of a millimetre and that is enough. If you have already done an x-clamp replacement, you probably over- or under-torqued the screws.', ['0011', '0013']],
  '0013': ['minor', 'DIY', 'RAM thermal. Almost always self-inflicted by penny mods, washer stacks or an over-tightened bolt mod flexing the board and lifting the RAM pads off their thermal pads. Undo the mod, re-pad properly.', ['0011', '0031']],
  '0020': ['fatal', 'pro only', 'GPU never answers POST. This is bump/die failure inside the package rather than a bad joint underneath it, so reflowing does nothing lasting. A donor GPU or a donor board is the only durable route.', ['0003', '0102']],
  '0021': ['moderate', 'DIY', 'DVD handshake timed out. Swap the SATA and drive power cables first, then try the board with a known-good drive. A bare board with no drive attached should still POST past this point on phats - if it does not, the Southbridge is gone.', ['0010', '1001']],
  '0022': ['fatal', 'pro only', 'On retail hardware this is CPU death or a NAND that no longer matches the console. On a glitched console it is far more mundane: wrong CPU key, a cold joint on the PLL/glitch line, or a bad NAND dump. Re-dump and compare before touching the CPU.', ['1033', '1013']],
  '0023': ['serious', 'pro only', 'CPU to Southbridge link is broken. Look for lifted pads on the FSB traces near the SB, especially on boards that have been reflowed with a heat gun by someone in a hurry.', ['0010', '0021']],
  '0031': ['serious', 'pro only', 'A RAM chip is shorted or bridged. Isolate each module by measuring its rails; if one module pulls the rail down, it needs to come off. Board-level work with hot air only.', ['0033', '0110']],
  '0032': ['serious', 'pro only', 'CPU to RAM path broken, typically from board warp cracking traces beneath the CPU. Boards that have lived through several bake or towel attempts end up here.', ['0031', '0100']],
  '0033': ['serious', 'pro only', 'RAM joints have failed under a module. Reball the affected chip; a straight reflow tends to come back within weeks of normal use.', ['0031', '0110']],
  '0100': ['serious', 'pro only', 'Cold joints under RAM or GPU. Frequently seen on consoles stored in lofts and garages, where humidity and thermal cycling finish off already marginal joints.', ['0102', '0110']],
  '0101': ['moderate', 'advanced', 'USB rail short or a dead Southbridge. Inspect every USB port for bent or bridged pins and check the polyfuses feeding them. Coronas genuinely do kill Southbridges, so if the ports are clean, suspect the chip.', ['0021', '0023']],
  '0102': ['fatal', 'pro only', 'The classic RROD. The low-TG underfill under the 90 nm GPU cracks and the solder bumps inside the package separate. Reflows and towels restore contact for days or weeks by expanding the package, never permanently. A GPU replacement or a donor board is the only fix that holds.', ['0103', '0110', '0020']],
  '0103': ['fatal', 'pro only', 'Structurally the same failure as 0102, reported from the CPU-GPU link side. Treat it identically: the package underfill has let go.', ['0102', '0032']],
  '0110': ['serious', 'pro only', 'GPU cannot reach RAM. Either a dead memory chip or, more often on 90 nm boards, a cracked pad on the GPU side of the memory bus. Reball the GPU and the suspect module together.', ['0102', '0033']],
  '0203': ['serious', 'pro only', 'Thermal management chain reporting an impossible state, usually because board warp has cracked joints under the GPU and the temperature sensing path with it.', ['0102', '0012']],
  '1001': ['moderate', 'DIY', 'Drive is getting bad voltage or its PCB firmware is corrupt. Try a different SATA power lead, then dump the drive firmware. Re-flashing the original key back is often enough to bring it round.', ['E64 / E65', 'E66']],
  '1003': ['minor', 'DIY', 'Drive short. Boot with the HDD removed: if the console runs fine, the fault is the caddy connector or the drive itself. Both are cheap to replace and need no soldering.', ['1010', 'E68']],
  '1010': ['minor', 'DIY', 'Shown as E68. Pull the hard drive and boot. If it clears, format or replace the drive; if it persists with no drive attached, look at the eFUSE/NAND side instead.', ['E68', '1003']],
  '1013': ['moderate', 'DIY', 'Dashboard update died part way through flashing. Put the full update on a FAT32 USB stick and boot with it attached. If the console will not take the update at all, the NAND blocks it writes to are failing.', ['E71 / E79', '0022']],
  '1022': ['fatal', 'advanced', 'Shown as E74. The GPU to HANA link has degraded. Reseating or replacing the AV cable is worth thirty seconds, but on Zephyr and early Falcon this is the same underfill failure as 0102 wearing a different hat.', ['E74', '0102', 'E73']],
  '1033': ['fatal', 'pro only', 'CPU will not initialise. A donor CPU has to be paired with a matching NAND dump, which is why these boards are usually parted out rather than repaired.', ['0022', '0032']],
  'E64 / E65': ['moderate', 'advanced', 'Drive firmware OSKV does not match what the dashboard expects, almost always after a failed or mismatched firmware flash. Restore the drive original firmware with the correct key.', ['E66', '1001']],
  'E66': ['moderate', 'advanced', 'Drive model spoof failed - the dashboard expects one manufacturer and finds another. Re-spoof with the correct target model, or fit the drive the console shipped with.', ['E64 / E65', '1001']],
  'E68': ['minor', 'DIY', 'Same as secondary 1010. Remove the hard drive, boot, then reattach. A drive that only faults when warm is on its way out.', ['1010', '1003']],
  'E71 / E79': ['moderate', 'DIY', 'Before assuming NAND damage, unplug your USB stick and boot again. A default.xex sitting in the root of a USB drive makes the dashboard try to launch it, and on an unglitched console that fails as E71 - the console is completely healthy. This is the standard BadUpdate / ABadAvatar false alarm: people leave the exploit stick plugged in after a session, reboot, and think they have bricked it. Move the payload into a subfolder or pull the stick. If E71 persists with nothing attached, then treat it as dashboard or NAND corruption: hold Sync while powering on to clear the cache, and re-apply the dashboard update from a FAT32 stick.', ['1013', '1033']],
  'E73': ['serious', 'advanced', 'Ethernet PHY or HANA fault. Inspect the ethernet port pins and the magnetics chip behind it - a shorted transformer here also drags power rails and can present as 0002.', ['0002', '1022']],
  'E74': ['fatal', 'pro only', 'Same failure as secondary 1022. Microsoft extended the warranty over this one for a reason: on 90 nm GPU boards it is a package failure, not a loose cable.', ['1022', '0102']]
};
d.errors = d.errors.map(e => {
  const x = E[e.code];
  return x ? { ...e, severity: x[0], difficulty: x[1], detail: x[2], related: x[3] } : e;
});

/* ---------- motherboards ---------- */
const M = {
  'Xenon': [90, 'GPU package underfill - 0102 and 0110, usually within the first two years of use.',
    'JTAG on kernel 2.0.7371 or lower; otherwise RGH1, which is still the fastest and most reliable glitch on Xenon.', true,
    { CPU: 'Waternoose, 90nm', GPU: 'Xenos 90nm + separate 90nm eDRAM die', NAND: '16 MB', DVD: 'Samsung MS25, Hitachi GDR-3120L, BenQ VAD6038' }, ['0102', '0110', '0100', '0020']],
  'Zephyr': [80, 'E74 / 1022 on the GPU-HANA link, plus the same 0102 underfill failure as Xenon.',
    'JTAG on 7371 or lower, otherwise RGH2. Same glitch points as Falcon.', true,
    { CPU: 'Waternoose, 90nm', GPU: 'Xenos 90nm, HANA scaler added', NAND: '16 MB', DVD: 'Hitachi GDR-3120L (78/79), BenQ VAD6038' }, ['1022', 'E74', '0102', 'E73']],
  'Early Falcon': [55, 'E74. The cooler 65 nm CPU kept the board alive long enough for the 90 nm GPU link to fail instead.',
    'JTAG on 7371 or lower, otherwise RGH2 - Falcon is the textbook RGH2 target and glitches quickly.', true,
    { CPU: 'Falcon, 65nm', GPU: 'Xenos 90nm', NAND: '16 MB', DVD: 'BenQ VAD6038, Lite-On DG-16D2S' }, ['E74', '1022', '0102']],
  'Late Falcon (v2)': [25, 'Rarely the GPU any more - expect DVD laser wear and dried thermal paste instead.',
    'JTAG if the dashboard was never updated past 7371, otherwise RGH2.', true,
    { CPU: 'Falcon, 65nm', GPU: 'Rhea 80nm, high-TG underfill', NAND: '16 MB', DVD: 'BenQ VAD6038, Lite-On DG-16D2S' }, ['0011', '1001']],
  'Opus': [30, 'Inherits Falcon behaviour. No HDMI, so a dying AV port is the more common annoyance.',
    'JTAG / RGH2 exactly like Falcon. Popular donor board for repairs of Xenon shells.', true,
    { CPU: 'Falcon, 65nm', GPU: '80nm', NAND: '16 MB', DVD: 'BenQ VAD6038, Lite-On DG-16D2S' }, ['0011', '0021']],
  'Jasper': [15, 'Very little. Failures are usually the DVD drive, the PSU or an abused HDD rather than the board.',
    'JTAG if still on 7371 or lower - Jasper is the most sought-after JTAG board. Otherwise RGH2. Big-block 256/512 MB NAND needs a programmer that supports it.', true,
    { CPU: 'Jasper, 65nm', GPU: '65nm', NAND: '16 MB, or 256/512 MB internal on Arcade', DVD: 'Lite-On DG-16D2S, BenQ VAD6038' }, ['0022', '1033', '1001']],
  'Tonasket (Kronos)': [10, 'Effectively nothing structural. Fans and optical drives wear out first.',
    'Shipped late enough that JTAG is rare; RGH2 is the practical route.', true,
    { CPU: 'Jasper, 65nm', GPU: '65nm with 65nm eDRAM', NAND: '16 MB / 256 MB', DVD: 'Lite-On DG-16D2S' }, ['1001', '1003']],
  'Trinity': [12, 'One red light rather than a ring on Slims. Dust-choked heatsink and a tired DVD laser are the common causes.',
    'RGH1.2 or RGH2 - Trinity is the standard Slim glitch target and boots fast.', true,
    { CGPU: 'Vejle 45nm, CPU+GPU+eDRAM on one die', NAND: '16 MB, or 4 GB eMMC on the 4 GB SKU', DVD: 'Lite-On DG-16D4S' }, ['1033', '0101', '0022']],
  'Corona (V1 - V6)': [20, 'Southbridge failures and dead 4 GB eMMC modules. A Corona that will not hold a dashboard update usually has a failing eMMC.',
    'RGH3 on V1-V5 gives the fastest boots of any 360. V6 rewired the eMMC and needs the dedicated V6 method or an eMMC adapter - or skip the soldering entirely and use BadUpdate.', true,
    { CGPU: '45nm', NAND: '16 MB, or 4 GB eMMC', DVD: 'Lite-On DG-16D5S (FW 0225 / 1175)' }, ['0101', '0022', '1033']],
  'Winchester': [5, 'Nothing notable. The most reliable board Microsoft shipped.',
    'No public glitch exists for Winchester - not JTAG-able, not RGH-able. BadUpdate is the only route in, and it needs the console to be sitting on dashboard 17559.', false,
    { CGPU: '45nm, no IHS', NAND: '4 GB eMMC', DVD: 'Lite-On DG-16D5S' }, ['1003', '1001']]
};
d.mobos = d.mobos.map(m => {
  const x = M[m.name];
  if (!x) return m;
  return { ...m, risk: x[0], faults: x[1], mod: x[2], glitchable: x[3], stats: { ...m.stats, ...x[4] }, codes: x[5] };
});

/* ---------- softmod / glitch compatibility ---------- */
const C = {
  'Xenon':            ['Yes - kernel 2.0.7371 or lower', 'RGH1 (best on Xenon)', 'Yes (dash 17559)'],
  'Zephyr':           ['Yes - 7371 or lower', 'RGH2', 'Yes (dash 17559)'],
  'Early Falcon':     ['Yes - 7371 or lower', 'RGH2', 'Yes (dash 17559)'],
  'Late Falcon (v2)': ['Yes - 7371 or lower', 'RGH2', 'Yes (dash 17559)'],
  'Opus':             ['Yes - 7371 or lower', 'RGH2', 'Yes (dash 17559)'],
  'Jasper':           ['Yes - 7371 or lower (the JTAG board to want)', 'RGH2', 'Yes (dash 17559)'],
  'Tonasket (Kronos)':['Rare - most shipped past 7371', 'RGH2', 'Yes (dash 17559)'],
  'Trinity':          ['No', 'RGH1.2 / RGH2', 'Yes (dash 17559)'],
  'Corona (V1 - V6)': ['No', 'RGH3 (V1-V5) / V6 needs the eMMC method', 'Yes (dash 17559)'],
  'Winchester':       ['No', 'None - no public glitch exists', 'Yes - the only way in (17559)']
};
d.mobos = d.mobos.map(m => {
  const c = C[m.name];
  return c ? { ...m, compat: { jtag: c[0], rgh: c[1], badupdate: c[2] } } : m;
});

/* BadUpdate / ABadAvatar reference block */
d.softmods = {
  badupdate: {
    name: 'BadUpdate',
    tag: 'software only, no soldering',
    summary: 'A non-persistent hypervisor exploit that runs one unsigned executable on an otherwise stock console. Because it is pure software it does not care which motherboard you have - it is confirmed working on every revision, Winchester included, which is the board no glitch hack can touch.',
    requires: [
      'Dashboard 17559, exactly. Install it from USB rather than over LIVE, in case Microsoft patches it.',
      'A FAT32 USB stick with the BadUpdatePayload and Content folders at its root (ABadAvatar also wants name.txt).',
      'Your unsigned retail .xex renamed to default.xex, placed inside the BadUpdatePayload folder.',
      'One of the two trigger games below. No disc needed if the game is already installed.',
      'Works with or without a hard drive - HDD-less consoles should install System Update 17559 from USB.'
    ],
    entries: [
      ['Tony Hawk\u2019s American Wasteland', 'save-game exploit', 'The NTSC, PAL and RF releases all work.'],
      ['Rock Band Blitz', 'save-game exploit', 'The trial is enough - you do not have to own the full game.']
    ],
    variants: [
      ['BadUpdate', 'grimdoomer', 'The original exploit.', 'https://github.com/grimdoomer/Xbox360BadUpdate'],
      ['ABadAvatar', 'shutterbug2000', 'A fork of Bad Update. Same two trigger games, same 17559 requirement.', 'https://github.com/shutterbug2000/ABadAvatar']
    ],
    caveats: [
      'Not persistent, and it cannot be made persistent. The console stays hacked only while it is powered on; reboot and you run it again.',
      'It runs a single unsigned executable. It is not a replacement for a softmod or a glitch chip.',
      'Expect roughly a 30% success rate per attempt, and up to 20 minutes of retrying before it takes.',
      'Disconnect Wi-Fi and Ethernet before running, and never sign in to the exploit profile - especially while on LIVE. Ban risk.',
      'Only those two games work. Another skateboarding or music game will not substitute.',
      'A stray default.xex left in a USB root will throw E71 on the next boot. The console is fine - pull the stick.'
    ],
    link: 'https://free60.org/Hacks/Bad_Update_Hack/'
  }
};

/* ---------- special editions: split MW3 out into its own entry ---------- */
const EDKEY = '[Info] Notable Limited & Special Editions';
if (d.named && d.named[EDKEY]) {
  const rows = d.named[EDKEY];
  const i = rows.findIndex(r => /MW3/.test(r[0]));
  if (i > -1) {
    rows[i] = ['Star Wars: The Old Republic / Battlefield 3', '2011', 'Slim (S)',
      'Bundle consoles with themed sleeves and decals but standard black hardware underneath.'];
    rows.splice(i + 1, 0, ['Call of Duty: Modern Warfare 3 Limited Edition', '2011', 'Slim (S)',
      '320 GB Xbox 360 S in a custom dark finish with MW3 branding, shipped with two matching wireless controllers and a wired headset. Notable for replacing the console’s own power-on and eject sounds with MW3 audio — one of the very few bundles that changed the hardware’s UI sounds rather than just its paint.']);
  }
}

fs.writeFileSync('data.json', JSON.stringify(d, null, 1));
console.log('enriched errors:', d.errors.filter(e => e.detail).length, '/', d.errors.length);
console.log('enriched boards:', d.mobos.filter(m => m.mod).length, '/', d.mobos.length);
