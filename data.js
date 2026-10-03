/* The 360 Diagnostic Wiki dataset. This file is the source of truth: edit it directly, the UI reads it.
   Run `python3 tools/validate.py` after editing. See CONTRIBUTING.md for the schema. */
window.DIAGS = {
 "errors": [
  {
   "code": "0001",
   "sys": "Power",
   "boards": "All Phats",
   "fix": "12V line short. Test with a known working PSU. If it still fails, check the MOSFETs near the main power connector on the motherboard for a short to ground.",
   "severity": "serious",
   "difficulty": "advanced",
   "detail": "Short on the 12 V rail. Measure resistance from the 12 V pin to ground with the PSU unplugged: a dead short (under ~1 ohm) means a failed MOSFET or a shorted tantalum cap on the input side. A brick that clicks to red is usually protecting itself, not broken.",
   "related": [
    "0002",
    "0003"
   ]
  },
  {
   "code": "0002",
   "sys": "Power/Eth",
   "boards": "Xenon, Zephyr",
   "fix": "CPU Vcore short. Usually a blown CPU MOSFET. Can also be a shorted Ethernet transformer chip on the back of the board.",
   "severity": "serious",
   "difficulty": "advanced",
   "detail": "CPU Vcore rail is pulled down. On Xenon/Zephyr the usual culprits are the CPU-side MOSFETs and the ethernet magnetics chip on the underside, which shorts and drags the same rail with it. Lift the ethernet transformer to isolate before condemning the CPU.",
   "related": [
    "0001",
    "E73"
   ]
  },
  {
   "code": "0003",
   "sys": "Power/GPU",
   "boards": "All",
   "fix": "GPU Vcore short. A power supply phase feeding the GPU is dead (bad MOSFET or capacitor) or the silicon inside the GPU is internally shorted.",
   "severity": "serious",
   "difficulty": "advanced",
   "detail": "GPU Vcore rail is dead or shorted. Check each phase of the GPU VRM for a blown FET and its gate driver. If the rail is shorted with all FETs removed, the short is inside the GPU package and the board is scrap unless you replace the die.",
   "related": [
    "0001",
    "0020"
   ]
  },
  {
   "code": "0010",
   "sys": "SB",
   "boards": "Xenon, Zephyr",
   "fix": "Southbridge is overheating or has cold joints. Check thermal connection. If fine, the chip may need a reflow/reball.",
   "severity": "moderate",
   "difficulty": "advanced",
   "detail": "Southbridge running hot or on cracked joints. The SB has no heatsink on early phats, so a clogged case plus a dry thermal pad is enough. Reflowing buys time; reballing with high-TG solder is the real fix.",
   "related": [
    "0021",
    "0023"
   ]
  },
  {
   "code": "0011",
   "sys": "CPU",
   "boards": "Phats",
   "fix": "CPU Overheating. Heatsink is unseated, thermal paste is dust, or fans have failed. Easiest RROD to fix.",
   "severity": "minor",
   "difficulty": "DIY",
   "detail": "Pure thermal. Pull the heatsinks, clean off the fossilised factory paste, re-paste with a decent non-conductive compound and confirm both fans spin. If it comes back within minutes, a fan header or the fan itself is dead.",
   "related": [
    "0012",
    "0013"
   ]
  },
  {
   "code": "0012",
   "sys": "GPU",
   "boards": "Phats",
   "fix": "GPU Overheating. Check GPU heatsink seating. Ensure the x-clamps haven't popped off or lost tension.",
   "severity": "minor",
   "difficulty": "DIY",
   "detail": "Thermal on the GPU side. Check x-clamp tension: a popped clamp lets the heatsink float a fraction of a millimetre and that is enough. If you have already done an x-clamp replacement, you probably over- or under-torqued the screws.",
   "related": [
    "0011",
    "0013"
   ]
  },
  {
   "code": "0013",
   "sys": "RAM",
   "boards": "Phats",
   "fix": "RAM Overheating. Often caused by terrible \"penny tricks\" or bolt-mods that bent the board and stressed the RAM thermal pads.",
   "severity": "minor",
   "difficulty": "DIY",
   "detail": "RAM thermal. Almost always self-inflicted by penny mods, washer stacks or an over-tightened bolt mod flexing the board and lifting the RAM pads off their thermal pads. Undo the mod, re-pad properly.",
   "related": [
    "0011",
    "0031"
   ]
  },
  {
   "code": "0020",
   "sys": "GPU Boot",
   "boards": "All Phats",
   "fix": "GPU failed to respond to POST. Usually signifies a dying GPU die (bump failure) requiring chip replacement.",
   "severity": "fatal",
   "difficulty": "pro only",
   "detail": "GPU never answers POST. This is bump/die failure inside the package rather than a bad joint underneath it, so reflowing does nothing lasting. A donor GPU or a donor board is the only durable route.",
   "related": [
    "0003",
    "0102"
   ]
  },
  {
   "code": "0021",
   "sys": "DVD / SB",
   "boards": "Xenon, Falcon",
   "fix": "DVD Drive timeout or Southbridge failure. If testing a bare board with no DVD drive connected, your Southbridge is dead.",
   "severity": "moderate",
   "difficulty": "DIY",
   "detail": "DVD handshake timed out. Swap the SATA and drive power cables first, then try the board with a known-good drive. A bare board with no drive attached should still POST past this point on phats - if it does not, the Southbridge is gone.",
   "related": [
    "0010",
    "1001"
   ]
  },
  {
   "code": "0022",
   "sys": "CPU / NAND",
   "boards": "Jasper, Slims",
   "fix": "Fatal CPU failure or bad NAND data. On RGH consoles, means wrong CPU key or bad PLL soldering. On retail, usually unrepairable CPU death.",
   "severity": "fatal",
   "difficulty": "pro only",
   "detail": "On retail hardware this is CPU death or a NAND that no longer matches the console. On a glitched console it is far more mundane: wrong CPU key, a cold joint on the PLL/glitch line, or a bad NAND dump. Re-dump and compare before touching the CPU.",
   "related": [
    "1033",
    "1013"
   ]
  },
  {
   "code": "0023",
   "sys": "SB",
   "boards": "All",
   "fix": "Southbridge to CPU communication error. Failing Southbridge chip or a severed pad on the FSB.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "CPU to Southbridge link is broken. Look for lifted pads on the FSB traces near the SB, especially on boards that have been reflowed with a heat gun by someone in a hurry.",
   "related": [
    "0010",
    "0021"
   ]
  },
  {
   "code": "0031",
   "sys": "RAM",
   "boards": "All",
   "fix": "RAM short circuit. A memory chip is damaged or bridged.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "A RAM chip is shorted or bridged. Isolate each module by measuring its rails; if one module pulls the rail down, it needs to come off. Board-level work with hot air only.",
   "related": [
    "0033",
    "0110"
   ]
  },
  {
   "code": "0032",
   "sys": "CPU / RAM",
   "boards": "Xenon, Zephyr",
   "fix": "CPU to RAM comms failure. Board warping likely snapped microscopic traces under the CPU.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "CPU to RAM path broken, typically from board warp cracking traces beneath the CPU. Boards that have lived through several bake or towel attempts end up here.",
   "related": [
    "0031",
    "0100"
   ]
  },
  {
   "code": "0033",
   "sys": "RAM",
   "boards": "Phats",
   "fix": "RAM configuration error. Solder joints under a RAM module have failed. Requires RAM reball.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "RAM joints have failed under a module. Reball the affected chip; a straight reflow tends to come back within weeks of normal use.",
   "related": [
    "0031",
    "0110"
   ]
  },
  {
   "code": "0100",
   "sys": "GPU / RAM",
   "boards": "Xenon, Zephyr",
   "fix": "Cold solder joint under RAM or GPU. Common on consoles stored in damp environments.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "Cold joints under RAM or GPU. Frequently seen on consoles stored in lofts and garages, where humidity and thermal cycling finish off already marginal joints.",
   "related": [
    "0102",
    "0110"
   ]
  },
  {
   "code": "0101",
   "sys": "USB / SB",
   "boards": "Corona, Trinity",
   "fix": "Short on USB ports or dead Southbridge. Inspect front/rear USB ports for bent pins. If clear, the SB chip is dead (common on Coronas).",
   "severity": "moderate",
   "difficulty": "advanced",
   "detail": "USB rail short or a dead Southbridge. Inspect every USB port for bent or bridged pins and check the polyfuses feeding them. Coronas genuinely do kill Southbridges, so if the ports are clean, suspect the chip.",
   "related": [
    "0021",
    "0023"
   ]
  },
  {
   "code": "0102",
   "sys": "GPU",
   "boards": "Xenon, Falcon",
   "fix": "The Classic RROD. Low-TG underfill beneath the GPU chip failed, breaking solder bumps inside the chip. The towel trick is a lie. Requires a GPU replacement.",
   "severity": "fatal",
   "difficulty": "pro only",
   "detail": "The classic RROD. The low-TG underfill under the 90 nm GPU cracks and the solder bumps inside the package separate. Reflows and towels restore contact for days or weeks by expanding the package, never permanently. A GPU replacement or a donor board is the only fix that holds.",
   "related": [
    "0103",
    "0110",
    "0020"
   ]
  },
  {
   "code": "0103",
   "sys": "GPU",
   "boards": "Zephyr, Falcon",
   "fix": "CPU to GPU comms error. Structurally identical to 0102; the GPU die underfill has failed.",
   "severity": "fatal",
   "difficulty": "pro only",
   "detail": "Structurally the same failure as 0102, reported from the CPU-GPU link side. Treat it identically: the package underfill has let go.",
   "related": [
    "0102",
    "0032"
   ]
  },
  {
   "code": "0110",
   "sys": "RAM",
   "boards": "All",
   "fix": "Memory error. The GPU cannot communicate with the RAM. Dead RAM chip or cracked solder pad under a module.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "GPU cannot reach RAM. Either a dead memory chip or, more often on 90 nm boards, a cracked pad on the GPU side of the memory bus. Reball the GPU and the suspect module together.",
   "related": [
    "0102",
    "0033"
   ]
  },
  {
   "code": "0203",
   "sys": "Thermal",
   "boards": "Phats",
   "fix": "System control thermal failure. Tied to cracked joints under the GPU from severe board warping.",
   "severity": "serious",
   "difficulty": "pro only",
   "detail": "Thermal management chain reporting an impossible state, usually because board warp has cracked joints under the GPU and the temperature sensing path with it.",
   "related": [
    "0102",
    "0012"
   ]
  },
  {
   "code": "1001",
   "sys": "DVD",
   "boards": "All",
   "fix": "DVD Drive receiving improper voltage, or firmware on the PCB is bricked.",
   "severity": "moderate",
   "difficulty": "DIY",
   "detail": "Drive is getting bad voltage or its PCB firmware is corrupt. Try a different SATA power lead, then dump the drive firmware. Re-flashing the original key back is often enough to bring it round.",
   "related": [
    "E64 / E65",
    "E66"
   ]
  },
  {
   "code": "1003",
   "sys": "HDD",
   "boards": "All",
   "fix": "Hard Drive short. Remove HDD and boot. If it works, the HDD enclosure or drive is fried.",
   "severity": "minor",
   "difficulty": "DIY",
   "detail": "Drive short. Boot with the HDD removed: if the console runs fine, the fault is the caddy connector or the drive itself. Both are cheap to replace and need no soldering.",
   "related": [
    "1010",
    "E68"
   ]
  },
  {
   "code": "1010",
   "sys": "HDD",
   "boards": "All",
   "fix": "Secondary for E68. eFUSE mismatch or HDD error. Pull the hard drive.",
   "severity": "minor",
   "difficulty": "DIY",
   "detail": "Shown as E68. Pull the hard drive and boot. If it clears, format or replace the drive; if it persists with no drive attached, look at the eFUSE/NAND side instead.",
   "related": [
    "E68",
    "1003"
   ]
  },
  {
   "code": "1013",
   "sys": "Dashboard",
   "boards": "All",
   "fix": "Usually a default.xex left in the root of an attached USB stick - unplug it and boot again before assuming anything is wrong. Otherwise a dashboard update that died part way through flashing.",
   "severity": "moderate",
   "difficulty": "DIY",
   "detail": "Verified on Falcon, Trinity and Corona: leave a USB stick with a default.xex in its root plugged in and the console throws this on the next boot. Nothing is wrong with it - pull the stick, or move the payload into a subfolder. Only if it persists with nothing attached is it a genuine half-flashed dashboard update, in which case put the full update on a FAT32 stick and boot with it attached; if it will not take the update at all, the NAND blocks it writes to are failing.",
   "related": [
    "E71",
    "0022"
   ]
  },
  {
   "code": "1022",
   "sys": "HANA / GPU",
   "boards": "Zephyr, Falcon",
   "fix": "Secondary for E74. Faulty AV cable (pulling on port), dead HANA chip, or broken traces between GPU and HANA. Usually a dying GPU.",
   "severity": "fatal",
   "difficulty": "advanced",
   "detail": "Shown as E74. The GPU to HANA link has degraded. Reseating or replacing the AV cable is worth thirty seconds, but on Zephyr and early Falcon this is the same underfill failure as 0102 wearing a different hat.",
   "related": [
    "E74",
    "0102",
    "E73"
   ]
  },
  {
   "code": "1033",
   "sys": "CPU",
   "boards": "Jasper, Trinity",
   "fix": "Fatal CPU initialization failure. Dead CPU. Unrepairable without a donor chip and matching NAND dump.",
   "severity": "fatal",
   "difficulty": "pro only",
   "detail": "CPU will not initialise. A donor CPU has to be paired with a matching NAND dump, which is why these boards are usually parted out rather than repaired.",
   "related": [
    "0022",
    "0032"
   ]
  },
  {
   "code": "E64 / E65",
   "sys": "DVD FW",
   "boards": "All",
   "fix": "DVD Drive Firmware error. Dashboard detects drive, but firmware OSKV doesn't match (usually a bad flashed firmware attempt).",
   "severity": "moderate",
   "difficulty": "advanced",
   "detail": "Drive firmware OSKV does not match what the dashboard expects, almost always after a failed or mismatched firmware flash. Restore the drive original firmware with the correct key.",
   "related": [
    "E66",
    "1001"
   ]
  },
  {
   "code": "E66",
   "sys": "DVD Model",
   "boards": "All",
   "fix": "DVD Drive spoofing failed. Dashboard expects a Lite-On but detects a BenQ (or similar mismatch).",
   "severity": "moderate",
   "difficulty": "advanced",
   "detail": "Drive model spoof failed - the dashboard expects one manufacturer and finds another. Re-spoof with the correct target model, or fit the drive the console shipped with.",
   "related": [
    "E64 / E65",
    "1001"
   ]
  },
  {
   "code": "E68",
   "sys": "HDD",
   "boards": "All",
   "fix": "Hard Drive error. Secondary code 1010. Remove HDD.",
   "severity": "minor",
   "difficulty": "DIY",
   "detail": "Same as secondary 1010. Remove the hard drive, boot, then reattach. A drive that only faults when warm is on its way out.",
   "related": [
    "1010",
    "1003"
   ]
  },
  {
   "code": "E71",
   "sys": "NAND",
   "boards": "All",
   "fix": "Dashboard corruption. Hold sync while booting to clear cache. If persistent, internal NAND blocks might be failing. Or a stray default.xex at the root of your USB is being picked up (shows E71 on screen).",
   "severity": "moderate",
   "difficulty": "DIY",
   "detail": "Before assuming NAND damage, unplug your USB stick and boot again. A default.xex sitting in the root of a USB drive makes the dashboard try to launch it, and on an unglitched console that fails as E71 - the console is completely healthy. This is the standard BadUpdate / ABadAvatar false alarm: people leave the exploit stick plugged in after a session, reboot, and think they have bricked it. Move the payload into a subfolder or pull the stick. If E71 persists with nothing attached, then treat it as dashboard or NAND corruption: hold Sync while powering on to clear the cache, and re-apply the dashboard update from a FAT32 stick.",
   "related": [
    "1013",
    "1033"
   ]
  },
  {
   "code": "E73",
   "sys": "HANA / Eth",
   "boards": "Zephyr, Falcon",
   "fix": "Ethernet port or HANA chip hardware failure. Inspect ethernet pins. Otherwise, HANA needs reflow/replacement.",
   "severity": "serious",
   "difficulty": "advanced",
   "detail": "Ethernet PHY or HANA fault. Inspect the ethernet port pins and the magnetics chip behind it - a shorted transformer here also drags power rails and can present as 0002.",
   "related": [
    "0002",
    "1022"
   ]
  },
  {
   "code": "E74",
   "sys": "GPU",
   "boards": "Falcon",
   "fix": "Secondary code 1022. Breakdown of comms between GPU and HANA chip. Almost always a dying GPU requiring replacement.",
   "severity": "fatal",
   "difficulty": "pro only",
   "detail": "Same failure as secondary 1022. Microsoft extended the warranty over this one for a reason: on 90 nm GPU boards it is a package failure, not a loose cable.",
   "related": [
    "1022",
    "0102"
   ]
  }
 ],
 "mobos": [
  {
   "name": "Xenon",
   "year": "2005 (Launch)",
   "highlight": false,
   "stats": {
    "Models": "Core / Premium (No HDMI)",
    "Process": "90nm CPU / 90nm GPU",
    "PSU": "203W (16.5A)",
    "CPU": "Waternoose, 90nm",
    "GPU": "Xenos 90nm + separate 90nm eDRAM die",
    "NAND": "16 MB",
    "DVD": "Samsung MS25, Hitachi GDR-3120L, BenQ VAD6038"
   },
   "desc": "The launch board. Notorious for a massive failure rate. Plagued by 0102/0110 errors caused by poor low-TG underfill on the GPU BGA failing under thermal stress. Avoid buying these.",
   "risk": 90,
   "faults": "GPU package underfill - 0102 and 0110, usually within the first two years of use.",
   "mod": "JTAG on kernel 2.0.7371 or lower; otherwise RGH1, which is still the fastest and most reliable glitch on Xenon.",
   "glitchable": true,
   "codes": [
    "0102",
    "0110",
    "0100",
    "0020"
   ],
   "ident": "No HDMI port and a 203W (16.5A) brick. Everything from launch to mid-2006. If it has HDMI it is not a Xenon.",
   "compat": {
    "jtag": "Yes - kernel 2.0.7371 or lower",
    "rgh": "RGH1 (best on Xenon)",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "F",
   "slug": "xenon",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": false,
    "watts": [
     203
    ],
    "dateFrom": "2005-11",
    "dateTo": "2006-12"
   }
  },
  {
   "name": "Zephyr",
   "year": "2007",
   "highlight": false,
   "stats": {
    "Models": "Elite / Premium (Added HDMI)",
    "Process": "90nm CPU / 90nm GPU",
    "PSU": "203W (16.5A)",
    "CPU": "Waternoose, 90nm",
    "GPU": "Xenos 90nm, HANA scaler added",
    "NAND": "16 MB",
    "DVD": "Hitachi GDR-3120L (78/79), BenQ VAD6038"
   },
   "desc": "Added the HDMI port and the HANA scaler chip. Unfortunately, it uses the exact same flawed 90nm GPU design as Xenon. Extremely prone to E74 and 0102.",
   "risk": 80,
   "faults": "E74 / 1022 on the GPU-HANA link, plus the same 0102 underfill failure as Xenon.",
   "mod": "JTAG on 7371 or lower, otherwise RGH2. Same glitch points as Falcon.",
   "glitchable": true,
   "codes": [
    "1022",
    "E74",
    "0102",
    "E73"
   ],
   "ident": "HDMI plus a 203W (16.5A) brick - that pairing is Zephyr and nothing else. Dated late 2006 to mid-2007.",
   "compat": {
    "jtag": "Yes - 7371 or lower",
    "rgh": "RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "F",
   "slug": "zephyr",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": true,
    "watts": [
     203
    ],
    "dateFrom": "2006-09",
    "dateTo": "2007-08"
   }
  },
  {
   "name": "Early Falcon",
   "year": "Late 2007",
   "highlight": false,
   "stats": {
    "Models": "Arcade / Pro / Elite",
    "Process": "65nm CPU / 90nm GPU",
    "PSU": "175W (14.2A)",
    "CPU": "Falcon, 65nm",
    "GPU": "Xenos 90nm",
    "NAND": "16 MB",
    "DVD": "BenQ VAD6038, Lite-On DG-16D2S"
   },
   "desc": "Introduced a cooler 65nm CPU. However, it kept the old 90nm GPU. Because of the HANA chip and board layout, E74 (connection break between GPU and HANA) spiked massively here.",
   "risk": 55,
   "faults": "E74. The cooler 65 nm CPU kept the board alive long enough for the 90 nm GPU link to fail instead.",
   "mod": "JTAG on 7371 or lower, otherwise RGH2 - Falcon is the textbook RGH2 target and glitches quickly.",
   "glitchable": true,
   "codes": [
    "E74",
    "1022",
    "0102"
   ],
   "ident": "HDMI with a 175W (14.2A) brick, made late 2007 to around mid-2008. The date on the rear sticker is what separates it from the v2.",
   "compat": {
    "jtag": "Yes - 7371 or lower",
    "rgh": "RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "C",
   "slug": "early-falcon",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": true,
    "watts": [
     175
    ],
    "dateFrom": "2007-08",
    "dateTo": "2008-06"
   }
  },
  {
   "name": "Late Falcon (v2)",
   "year": "Mid 2008 (The Fix)",
   "highlight": true,
   "stats": {
    "Models": "Late Pro / Arcade",
    "Process": "65nm CPU / 80nm GPU (Rhea)",
    "PSU": "175W (14.2A)",
    "CPU": "Falcon, 65nm",
    "GPU": "Rhea 80nm, high-TG underfill",
    "NAND": "16 MB",
    "DVD": "BenQ VAD6038, Lite-On DG-16D2S"
   },
   "desc": "A stealth revision by Microsoft. They swapped the GPU to an 80nm \"Rhea\" chip with high-TG underfill. If you have a Falcon manufactured in mid-to-late 2008, it is highly resilient to RROD. A solid board.",
   "risk": 25,
   "faults": "Rarely the GPU any more - expect DVD laser wear and dried thermal paste instead.",
   "mod": "JTAG if the dashboard was never updated past 7371, otherwise RGH2.",
   "glitchable": true,
   "codes": [
    "0011",
    "1001"
   ],
   "ident": "Externally identical to an early Falcon - same brick, same ports. Only the manufacture date tells them apart: mid to late 2008. Opened up, the GPU die is visibly smaller than the 90nm part.",
   "compat": {
    "jtag": "Yes - 7371 or lower",
    "rgh": "RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "A",
   "slug": "late-falcon-v2",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": true,
    "watts": [
     175
    ],
    "dateFrom": "2008-05",
    "dateTo": "2008-12"
   }
  },
  {
   "name": "Opus",
   "year": "2008",
   "highlight": false,
   "stats": {
    "Models": "Warranty Replacements Only",
    "Process": "65nm CPU / 80nm GPU",
    "PSU": "175W (14.2A) - No HDMI",
    "CPU": "Falcon, 65nm",
    "GPU": "80nm",
    "NAND": "16 MB",
    "DVD": "BenQ VAD6038, Lite-On DG-16D2S"
   },
   "desc": "A Frankenstein board. This is a Falcon architecture reshaped to fit inside a broken Xenon case (which lacks an HDMI cutout). Used solely for Microsoft repair center returns.",
   "risk": 30,
   "faults": "Inherits Falcon behaviour. No HDMI, so a dying AV port is the more common annoyance.",
   "mod": "JTAG / RGH2 exactly like Falcon. Popular donor board for repairs of Xenon shells.",
   "glitchable": true,
   "codes": [
    "0011",
    "0021"
   ],
   "ident": "A 175W (14.2A) brick with no HDMI port. Nothing else ships that combination, so it is unmistakable from the back panel alone.",
   "compat": {
    "jtag": "Yes - 7371 or lower",
    "rgh": "RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "B",
   "slug": "opus",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": false,
    "watts": [
     175
    ],
    "dateFrom": "2008-01",
    "dateTo": "2009-12"
   }
  },
  {
   "name": "Jasper",
   "year": "Late 2008",
   "highlight": false,
   "stats": {
    "Models": "Arcade / Pro / Elite",
    "Process": "65nm CPU / 65nm GPU",
    "PSU": "150W (12.1A)",
    "CPU": "Jasper, 65nm",
    "GPU": "65nm",
    "NAND": "16 MB, or 256/512 MB internal on Arcade",
    "DVD": "Lite-On DG-16D2S, BenQ VAD6038"
   },
   "desc": "The true fix. Shrunk the GPU to 65nm, finally eliminating the massive heat and underfill issues. Arcade units had 16MB/256MB/512MB internal memory built onto the board.",
   "risk": 15,
   "faults": "Very little. Failures are usually the DVD drive, the PSU or an abused HDD rather than the board.",
   "mod": "JTAG if still on 7371 or lower - Jasper is the most sought-after JTAG board. Otherwise RGH2. Big-block 256/512 MB NAND needs a programmer that supports it.",
   "glitchable": true,
   "codes": [
    "0022",
    "1033",
    "1001"
   ],
   "ident": "HDMI with a 150W (12.1A) brick, late 2008 onward. Arcade units report 256 MB or 512 MB of internal storage in the dashboard storage settings.",
   "compat": {
    "jtag": "Yes - 7371 or lower (the JTAG board to want)",
    "rgh": "RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "S",
   "slug": "jasper",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": true,
    "watts": [
     150
    ],
    "dateFrom": "2008-09",
    "dateTo": "2009-12"
   }
  },
  {
   "name": "Tonasket (Kronos)",
   "year": "Late 2009",
   "highlight": true,
   "stats": {
    "Models": "Final Phat Runs (Super Elite)",
    "Process": "65nm CPU / 65nm GPU (65nm eDRAM)",
    "PSU": "150W (12.1A)",
    "CPU": "Jasper, 65nm",
    "GPU": "65nm with 65nm eDRAM",
    "NAND": "16 MB / 256 MB",
    "DVD": "Lite-On DG-16D2S"
   },
   "desc": "Often called \"Jasper v2\". Reduced the physical size of the eDRAM on the GPU. Widely considered by the modding scene to be the most bulletproof Xbox 360 phat motherboard ever made.",
   "risk": 10,
   "faults": "Effectively nothing structural. Fans and optical drives wear out first.",
   "mod": "Shipped late enough that JTAG is rare; RGH2 is the practical route.",
   "glitchable": true,
   "codes": [
    "1001",
    "1003"
   ],
   "ident": "Same 150W brick and the same ports as a Jasper - the manufacture date is the only outside tell, late 2009 into 2010.",
   "compat": {
    "jtag": "Rare - most shipped past 7371",
    "rgh": "RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "S+",
   "slug": "tonasket-kronos",
   "id": {
    "chassis": [
     "Phat"
    ],
    "hdmi": true,
    "watts": [
     150
    ],
    "dateFrom": "2009-09",
    "dateTo": "2010-08"
   }
  },
  {
   "name": "Trinity",
   "year": "2010",
   "highlight": false,
   "stats": {
    "Models": "Xbox 360 S (Glossy)",
    "Process": "45nm CGPU (Combined)",
    "PSU": "135W (10.83A)",
    "CGPU": "Vejle 45nm, CPU+GPU+eDRAM on one die",
    "NAND": "16 MB, or 4 GB eMMC on the 4 GB SKU",
    "DVD": "Lite-On DG-16D4S"
   },
   "desc": "First Slim board. Combined the CPU and GPU into one chip (CGPU). Kept the HANA chip. Very reliable. When it fails, it usually throws a \"Red Dot of Death\" (0101).",
   "risk": 12,
   "faults": "One red light rather than a ring on Slims. Dust-choked heatsink and a tired DVD laser are the common causes.",
   "mod": "RGH1.2 or RGH2 - Trinity is the standard Slim glitch target and boots fast.",
   "glitchable": true,
   "codes": [
    "1033",
    "0101",
    "0022"
   ],
   "ident": "The glossy Xbox 360 S chassis with the touch-sensitive power button, made 2010 into 2011. Every early S is a Trinity; from late 2011 they start being Corona.",
   "compat": {
    "jtag": "No",
    "rgh": "RGH1.2 / RGH2",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "S",
   "slug": "trinity",
   "id": {
    "chassis": [
     "Slim (S)"
    ],
    "hdmi": true,
    "watts": [
     135
    ],
    "dateFrom": "2010-06",
    "dateTo": "2011-12"
   }
  },
  {
   "name": "Corona (V1 - V6)",
   "year": "2011 - 2013",
   "highlight": false,
   "stats": {
    "Models": "Xbox 360 S / Xbox 360 E",
    "Process": "45nm CGPU",
    "PSU": "120W / 115W (9.6A)",
    "CGPU": "45nm",
    "NAND": "16 MB, or 4 GB eMMC",
    "DVD": "Lite-On DG-16D5S (FW 0225 / 1175)"
   },
   "desc": "Removed the HANA chip and integrated it into the Southbridge. Introduced 4GB eMMC NANDs. Southbridge failures and dead 4GB NANDs are the most common faults here.",
   "risk": 20,
   "faults": "Southbridge failures and dead 4 GB eMMC modules. A Corona that will not hold a dashboard update usually has a failing eMMC.",
   "mod": "RGH3 on V1-V5 gives the fastest boots of any 360. V6 rewired the eMMC and needs the dedicated V6 method or an eMMC adapter - or skip the soldering entirely and use BadUpdate.",
   "glitchable": true,
   "codes": [
    "0101",
    "0022",
    "1033"
   ],
   "ident": "An S from late 2011 on, any E before the Winchester run, or anything with 4 GB of soldered eMMC. Corona folded the HANA into the Southbridge, so opened up there is no separate scaler chip beside the CGPU.",
   "compat": {
    "jtag": "No",
    "rgh": "RGH3 (V1-V5) / V6 needs the eMMC method",
    "badupdate": "Yes (dash 17559)"
   },
   "tier": "A",
   "slug": "corona-v1-v6",
   "id": {
    "chassis": [
     "Slim (S)",
     "E"
    ],
    "hdmi": true,
    "watts": [
     120,
     115
    ],
    "dateFrom": "2011-08",
    "dateTo": "2013-12"
   }
  },
  {
   "name": "Winchester",
   "year": "2014",
   "highlight": false,
   "stats": {
    "Models": "Late Xbox 360 E",
    "Process": "45nm CGPU (No IHS)",
    "PSU": "115W (9.6A)",
    "CGPU": "45nm, no IHS",
    "NAND": "4 GB eMMC",
    "DVD": "Lite-On DG-16D5S"
   },
   "desc": "The final revision. Microsoft removed the metal Integrated Heat Spreader (IHS) from the CGPU. Extremely reliable hardware-wise.",
   "risk": 5,
   "faults": "Nothing notable. The most reliable board Microsoft shipped.",
   "mod": "No public glitch exists for Winchester - not JTAG-able, not RGH-able. BadUpdate is the only route in, and it needs the console to be sitting on dashboard 17559.",
   "glitchable": false,
   "codes": [
    "1003",
    "1001"
   ],
   "ident": "An Xbox 360 E made from 2014 on. Opened up it is unmistakable: the CGPU has no metal heat spreader, just bare silicon under the heatsink.",
   "compat": {
    "jtag": "No",
    "rgh": "None - no public glitch exists",
    "badupdate": "Yes - the only way in (17559)"
   },
   "tier": "S+",
   "slug": "winchester",
   "id": {
    "chassis": [
     "E"
    ],
    "hdmi": true,
    "watts": [
     115
    ],
    "dateFrom": "2014-01",
    "dateTo": "2016-04"
   }
  }
 ],
 "tiers": [
  {
   "tier": "S+",
   "cls": "tier-s",
   "items": [
    "Winchester",
    "Tonasket / Kronos"
   ]
  },
  {
   "tier": "S",
   "cls": "tier-sp",
   "items": [
    "Jasper",
    "Trinity"
   ]
  },
  {
   "tier": "A",
   "cls": "tier-a",
   "items": [
    "Late Falcon v2 (Rhea)",
    "Corona V2-V5"
   ]
  },
  {
   "tier": "B",
   "cls": "tier-b",
   "items": [
    "Opus",
    "Corona V1",
    "Corona V6"
   ]
  },
  {
   "tier": "C",
   "cls": "tier-c",
   "items": [
    "Early Falcon"
   ]
  },
  {
   "tier": "F",
   "cls": "tier-f",
   "items": [
    "Zephyr",
    "Xenon"
   ]
  }
 ],
 "score": [
  {
   "rank": 1,
   "board": "Winchester",
   "rel": 10,
   "relText": "10 / 10",
   "why": "No IHS, coolest-running CGPU, effectively zero failure reports. The most reliable 360 board made."
  },
  {
   "rank": 2,
   "board": "Tonasket (Kronos)",
   "rel": 10,
   "relText": "10 / 10",
   "why": "Smallest-die phat, best underfill, tiny eDRAM. The \"buy it for life\" phat."
  },
  {
   "rank": 3,
   "board": "Jasper",
   "rel": 9,
   "relText": "9 / 10",
   "why": "65nm GPU killed the RROD era. The phat that finally ran cool and stayed alive."
  },
  {
   "rank": 4,
   "board": "Trinity",
   "rel": 9,
   "relText": "9 / 10",
   "why": "First slim, unified CGPU, runs cool. Occasional 0101 Southbridge/USB death, otherwise dependable."
  },
  {
   "rank": 5,
   "board": "Late Falcon v2 (Rhea)",
   "rel": 8,
   "relText": "8 / 10",
   "why": "80nm Rhea GPU with high-TG underfill. The one phat Falcon worth trusting if it's a mid/late-2008 build."
  },
  {
   "rank": 6,
   "board": "Corona V2-V5",
   "rel": 7,
   "relText": "7 / 10",
   "why": "Coolest slim-era silicon, but the 4GB eMMC and integrated Southbridge are the weak points."
  },
  {
   "rank": 7,
   "board": "Opus",
   "rel": 7,
   "relText": "7 / 10",
   "why": "Falcon-class silicon in a Xenon shell. Fine board, but rare and no HDMI."
  },
  {
   "rank": 8,
   "board": "Corona V1 / V6",
   "rel": 6,
   "relText": "6 / 10",
   "why": "V1 is an early run with more eMMC issues; V6 is a stripped late revision."
  },
  {
   "rank": 9,
   "board": "Early Falcon",
   "rel": 4,
   "relText": "4 / 10",
   "why": "65nm CPU but still the old 90nm GPU. E74 capital of the 360 world."
  },
  {
   "rank": 10,
   "board": "Zephyr",
   "rel": 2,
   "relText": "2 / 10",
   "why": "Xenon internals plus HDMI. Same doomed 90nm GPU, same 0102/E74 fate."
  },
  {
   "rank": 11,
   "board": "Xenon",
   "rel": 1,
   "relText": "1 / 10",
   "why": "Launch board, worst underfill, highest RROD rate ever recorded on a console. Collector curiosity only."
  }
 ],
 "models": [
  {
   "gen": "Phat",
   "sku": "Core",
   "years": "2005 - 2007",
   "storage": "None (memory unit only)",
   "finish": "Matte white",
   "notes": "Bare entry model: no HDD, composite cable, wired controller. Discontinued for the Arcade."
  },
  {
   "gen": "Phat",
   "sku": "Pro / Premium",
   "years": "2005 - 2009",
   "storage": "20 / 60 GB HDD",
   "finish": "Matte white",
   "notes": "The \"standard\" launch console: detachable HDD, wireless controller, component HD cable, headset."
  },
  {
   "gen": "Phat",
   "sku": "Arcade",
   "years": "2007 - 2010",
   "storage": "256 MB → 512 MB internal (+ optional HDD)",
   "finish": "Matte white",
   "notes": "Replaced Core. Onboard flash instead of an HDD, 5 Arcade games, HDMI added on later Falcon/Jasper runs."
  },
  {
   "gen": "Phat",
   "sku": "Elite",
   "years": "2007 - 2010",
   "storage": "120 / 250 GB HDD",
   "finish": "Matte black",
   "notes": "First black 360, first with HDMI as standard, black accessories. \"Super Elite\" 250 GB arrived 2010."
  },
  {
   "gen": "Phat",
   "sku": "Elite (250 GB) / bundles",
   "years": "2010",
   "storage": "250 GB HDD",
   "finish": "Matte black",
   "notes": "Final Phat retail configuration, sold alongside the newly launched Slim before being retired."
  },
  {
   "gen": "Slim (S)",
   "sku": "4 GB",
   "years": "2010 - 2013",
   "storage": "4 GB internal (eMMC/NAND)",
   "finish": "Matte black",
   "notes": "Budget SKU. Soldered flash, no 2.5\" bay populated. Dedicated Kinect port, built-in Wi-Fi, touch-sensitive power/eject."
  },
  {
   "gen": "Slim (S)",
   "sku": "250 GB",
   "years": "2010 - 2013",
   "storage": "250 GB 2.5\" HDD",
   "finish": "Glossy black",
   "notes": "The mainstream Slim. Proprietary internal laptop-style drive behind a side hatch."
  },
  {
   "gen": "Slim (S)",
   "sku": "320 GB (bundle)",
   "years": "2012 - 2013",
   "storage": "320 GB 2.5\" HDD",
   "finish": "Glossy / matte",
   "notes": "Only sold in game/Kinect bundles (Halo 4, Holiday), never as a standalone box."
  },
  {
   "gen": "Slim (S)",
   "sku": "4 GB + Kinect",
   "years": "2010 - 2013",
   "storage": "4 GB internal",
   "finish": "Matte black",
   "notes": "Standard Kinect starter bundle. Same console as the plain 4 GB."
  },
  {
   "gen": "E",
   "sku": "4 GB",
   "years": "2013 - 2016",
   "storage": "4 GB internal",
   "finish": "Matte black (two-tone)",
   "notes": "Xbox One-styled restyle. Dropped one USB port, S/PDIF and the original AV multi-out; component video gone."
  },
  {
   "gen": "E",
   "sku": "250 GB",
   "years": "2013 - 2016",
   "storage": "250 GB 2.5\" HDD",
   "finish": "Matte black (two-tone)",
   "notes": "Mainstream E. Same internals as a late Corona/Winchester Slim in a new shell."
  },
  {
   "gen": "E",
   "sku": "500 GB (bundle)",
   "years": "2014 - 2015",
   "storage": "500 GB 2.5\" HDD",
   "finish": "Matte black",
   "notes": "Late GTA V / Forza Horizon 2 bundles. Rarest factory storage size."
  }
 ],
 "editions": [
  {
   "name": "Halo 3 Special Edition",
   "year": "2007",
   "chassis": "Phat",
   "notes": "\"Spartan\" green & gold shell, matching controller, Halo boot chime. 20 GB HDD. The first limited 360.",
   "board": "Zephyr - late stock may be an early Falcon"
  },
  {
   "name": "The Simpsons Movie",
   "year": "2007",
   "chassis": "Phat",
   "notes": "Contest-only yellow console with Simpsons cloud faceplate. Roughly 100 made — one of the rarest 360s.",
   "board": "Zephyr"
  },
  {
   "name": "Resident Evil 5",
   "year": "2009",
   "chassis": "Phat",
   "notes": "Japan/US Elite in custom red with RE5 artwork, red controller. 120 GB.",
   "board": "Jasper"
  },
  {
   "name": "Modern Warfare 2",
   "year": "2009",
   "chassis": "Phat",
   "notes": "Dark grey/olive Elite with laser-etched MW2 logo, red ring of light, custom boot. 250 GB.",
   "board": "Jasper"
  },
  {
   "name": "Final Fantasy XIII (Lightning Edition)",
   "year": "2009",
   "chassis": "Phat",
   "notes": "Japan-only pearl-white Elite with airbrushed Lightning art, white controller. 250 GB.",
   "board": "Jasper, late units Tonasket"
  },
  {
   "name": "Special Edition Blue",
   "year": "2010",
   "chassis": "Phat",
   "notes": "Translucent blue Elite shell + blue controller, first sold in the \"Family Bundle\". Also Japan retail.",
   "board": "Jasper or Tonasket (Kronos)"
  },
  {
   "name": "Halo: Reach",
   "year": "2010",
   "chassis": "Slim (S)",
   "notes": "Silver/black UNSC etching, matching controllers, Reach boot animation + sounds. 250 GB. First limited Slim.",
   "board": "Trinity"
  },
  {
   "name": "Kinect Star Wars (R2-D2 / C-3PO)",
   "year": "2012",
   "chassis": "Slim (S)",
   "notes": "R2-D2-painted console with astromech beeps for the power/eject tones, gold C-3PO controller, white Kinect. 320 GB.",
   "board": "Corona"
  },
  {
   "name": "Gears of War 3",
   "year": "2011",
   "chassis": "Slim (S)",
   "notes": "Weathered red/brown \"Crimson Omen\" shell, custom controller, Gears boot sounds. 320 GB.",
   "board": "Trinity"
  },
  {
   "name": "Star Wars: The Old Republic / Battlefield 3",
   "year": "2011",
   "chassis": "Slim (S)",
   "notes": "Bundle consoles with themed sleeves and decals but standard black hardware underneath.",
   "board": "Trinity"
  },
  {
   "name": "Call of Duty: Modern Warfare 3 Limited Edition",
   "year": "2011",
   "chassis": "Slim (S)",
   "notes": "320 GB Xbox 360 S in a custom dark finish with MW3 branding, shipped with two matching wireless controllers and a wired headset. Notable for replacing the console’s own power-on and eject sounds with MW3 audio — one of the very few bundles that changed the hardware’s UI sounds rather than just its paint.",
   "board": "Trinity - late stock may be Corona"
  },
  {
   "name": "Halo 4",
   "year": "2012",
   "chassis": "Slim (S)",
   "notes": "Blue-accented grey shell, \"Forward Unto Dawn\" laser etching, blue controllers, custom boot + sounds. 320 GB.",
   "board": "Corona"
  },
  {
   "name": "Chrome Series (Red / Blue / Silver)",
   "year": "2012 - 2013",
   "chassis": "Slim (S)",
   "notes": "Region-limited mirror-chrome side panels over the glossy 320 GB Slim.",
   "board": "Corona"
  },
  {
   "name": "GTA V",
   "year": "2013",
   "chassis": "Slim (S)",
   "notes": "Blue-accented 500 GB Slim with GTA V branding, custom controller, unique boot. Last major limited 360.",
   "board": "Corona"
  },
  {
   "name": "Forza Horizon 2 / Sunset Overdrive era",
   "year": "2014 - 2015",
   "chassis": "E",
   "notes": "Late 500 GB E bundles — decals and packaging only, no shell restyle.",
   "board": "Winchester"
  }
 ],
 "softmods": {
  "badupdate": {
   "name": "BadUpdate",
   "tag": "software only, no soldering",
   "summary": "A non-persistent hypervisor exploit that runs one unsigned executable on an otherwise stock console. Because it is pure software it does not care which motherboard you have - it is confirmed working on every revision, Winchester included, which is the board no glitch hack can touch.",
   "requires": [
    "Dashboard 17559, exactly. Install it from USB rather than over LIVE, in case Microsoft patches it.",
    "A FAT32 USB stick with the BadUpdatePayload and Content folders at its root (ABadAvatar also wants name.txt).",
    "Your unsigned retail .xex renamed to default.xex, placed inside the BadUpdatePayload folder.",
    "One of the two trigger games below. No disc needed if the game is already installed.",
    "Works with or without a hard drive - HDD-less consoles should install System Update 17559 from USB."
   ],
   "entries": [
    [
     "Tony Hawk’s American Wasteland",
     "save-game exploit",
     "The NTSC, PAL and RF releases all work."
    ],
    [
     "Rock Band Blitz",
     "save-game exploit",
     "The trial is enough - you do not have to own the full game."
    ]
   ],
   "variants": [
    [
     "BadUpdate",
     "grimdoomer",
     "The original exploit.",
     "https://github.com/grimdoomer/Xbox360BadUpdate"
    ],
    [
     "ABadAvatar",
     "shutterbug2000",
     "A fork of Bad Update. Same two trigger games, same 17559 requirement.",
     "https://github.com/shutterbug2000/ABadAvatar"
    ]
   ],
   "caveats": [
    "Not persistent, and it cannot be made persistent. The console stays hacked only while it is powered on; reboot and you run it again.",
    "It runs a single unsigned executable. It is not a replacement for a softmod or a glitch chip.",
    "Expect roughly a 30% success rate per attempt, and up to 20 minutes of retrying before it takes.",
    "Disconnect Wi-Fi and Ethernet before running, and never sign in to the exploit profile - especially while on LIVE. Ban risk.",
    "Only those two games work. Another skateboarding or music game will not substitute.",
    "A stray default.xex left in a USB root will throw E71 on the next boot. The console is fine - pull the stick."
   ],
   "link": "https://free60.org/Hacks/Bad_Update_Hack/"
  }
 },
 "psuConnectors": [
  {
   "watts": "203W",
   "amps": "12V / 16.5A",
   "boards": "Xenon, Zephyr",
   "note": "The launch brick, and the only one those two boards accept."
  },
  {
   "watts": "175W",
   "amps": "12V / 14.2A",
   "boards": "Opus, Early and Late Falcon",
   "note": "Arrived with the 65nm CPU, and reused for the Opus warranty boards."
  },
  {
   "watts": "150W",
   "amps": "12V / 12.1A",
   "boards": "Jasper, Tonasket (Kronos)",
   "note": "The final phat brick, from the 65nm GPU shrink onward."
  }
 ],
 "psuNote": "The three phat generations use differently keyed connectors and are not freely interchangeable - match the wattage printed on the brick to the board rather than assuming a plug that physically enters is the right one. Slim and E consoles use a smaller connector of their own, so there is no crossover with the phats at all.",
 "meta": {
  "updated": "2026-10-03",
  "repo": "https://github.com/nat649/ultimate-xbox360-diags"
 },
 "primary": [
  {
   "chassis": "Phat",
   "lights": 1,
   "title": "Hardware error, E-code on screen",
   "meaning": "One red quadrant means the console caught a hardware error and printed an E-code on the TV (E74, E68, E71...).",
   "action": "Read the E-code off the screen and convert it in the E-code converter below. It is the same number as the secondary code, just in base 10.",
   "route": "decoder"
  },
  {
   "chassis": "Phat",
   "lights": 2,
   "title": "Overheating",
   "meaning": "Two red quadrants is thermal protection. The console shut itself down to stop the CPU or GPU cooking.",
   "action": "Power off, let it cool for 30 minutes, give it space on all sides and blow the dust out of the intake. If it comes back after cleaning, check the fans and repaste.",
   "route": "troubleshoot/heat"
  },
  {
   "chassis": "Phat",
   "lights": 3,
   "title": "General hardware failure (the RROD)",
   "meaning": "Three red quadrants is the classic Red Ring of Death. Something failed the boot self-test, and the secondary code says what.",
   "action": "Read the secondary code (hold Sync, tap Eject four times) and enter it in the decoder. Do not guess, and do not towel-trick it.",
   "route": "decoder"
  },
  {
   "chassis": "Phat",
   "lights": 4,
   "title": "No AV cable detected",
   "meaning": "Four red quadrants means the console cannot see an AV cable.",
   "action": "Reseat or swap the AV cable and look into the AV port for bent pins. HDMI-equipped boards also boot fine with only an HDMI cable.",
   "route": "troubleshoot/novideo"
  },
  {
   "chassis": "Slim (S)",
   "lights": 0,
   "title": "Red power light",
   "meaning": "The S has no ring. A red light on the power button with no E-code is the overheat cut-out; with an E-code on screen it is a hardware error.",
   "action": "If there is an E-code, convert it below. If not, treat it as overheating: cool down, clear the vents, check the fan.",
   "route": "troubleshoot/slimred"
  },
  {
   "chassis": "E",
   "lights": 0,
   "title": "Flashing / coloured power light",
   "meaning": "The E reports faults on the TV rather than with lights. A power light that flashes and shuts off is usually thermal protection.",
   "action": "Check the TV for an E-code first; otherwise follow the overheating path.",
   "route": "troubleshoot/slimred"
  }
 ],
 "brick": [
  {
   "led": "Off",
   "color": "#3a4148",
   "meaning": "No mains power is reaching the brick, or the brick is dead.",
   "action": "Try another wall socket and the mains cable from a known-good brick. Still dark: replace the brick with the correct wattage for your board."
  },
  {
   "led": "Orange",
   "color": "#f0ad3c",
   "meaning": "Standby. The brick is healthy and waiting for the console to ask for power.",
   "action": "Normal when the console is off. If it stays orange when you press power, the problem is the console power button or board, not the brick."
  },
  {
   "led": "Green",
   "color": "#7fc45a",
   "meaning": "Delivering 12 V. The console is on.",
   "action": "Normal. If the console still shows no lights, the fault is on the console side."
  },
  {
   "led": "Red",
   "color": "#f2604f",
   "meaning": "Protection. The brick sees a short, an overload or its own overheating.",
   "action": "Unplug the DC lead from the console. If the brick returns to orange, the short is in the console (see 0001). If it stays red after 30 minutes of cooling, the brick has failed."
  }
 ],
 "tools": {
  "DIY": [
   "T8 and T10 Torx drivers",
   "Plastic pry tools",
   "Compressed air",
   "99% isopropyl alcohol",
   "Thermal paste"
  ],
  "advanced": [
   "Multimeter",
   "Temperature-controlled soldering iron",
   "Flux and desoldering braid",
   "Hot air station",
   "Kapton tape"
  ],
  "pro only": [
   "BGA rework station with bottom preheater",
   "Reballing stencils and solder balls",
   "Microscope or loupe",
   "Known-good donor parts"
  ]
 },
 "flows": {
  "start": {
   "q": "What is the console doing?",
   "options": [
    {
     "label": "Nothing at all, no lights",
     "next": "nopower"
    },
    {
     "label": "Red lights on the ring (original Phat)",
     "next": "redring"
    },
    {
     "label": "Red light on the power button (S / E)",
     "next": "slimred"
    },
    {
     "label": "Powers on but no picture",
     "next": "novideo"
    },
    {
     "label": "An E-code on the TV (E68, E74...)",
     "next": "ecode"
    },
    {
     "label": "Freezes, artifacts or crashes",
     "next": "freeze"
    },
    {
     "label": "Disc or tray problems",
     "next": "disc"
    },
    {
     "label": "Very loud fan or very hot",
     "next": "heat"
    }
   ]
  },
  "nopower": {
   "q": "Look at the LED on the power brick. What colour is it?",
   "options": [
    {
     "label": "Off",
     "next": "brickoff"
    },
    {
     "label": "Orange, and it stays orange when I press power",
     "next": "orangestays"
    },
    {
     "label": "Red",
     "next": "brickred"
    },
    {
     "label": "Green, but the console shows nothing",
     "next": "greennothing"
    }
   ]
  },
  "brickoff": {
   "title": "No power reaching the brick",
   "result": "Try a different wall socket and swap the mains (figure-8 / kettle) cable. If the LED is still dark with a known-good cable and socket, the brick is dead. Replace it with the wattage your board expects: the connectors are keyed per generation.",
   "links": [
    {
     "label": "Power brick by generation",
     "route": "boards"
    },
    {
     "label": "Brick LED meanings",
     "route": "decoder"
    }
   ]
  },
  "orangestays": {
   "title": "The brick is fine, the console is not asking for power",
   "result": "Orange is healthy standby. Try powering on from the controller Guide button or the eject button. On a Phat, check the RF module board and its ribbon; on an S, the capacitive power button misbehaves with dirt or a damaged flex. If nothing responds at all, the fault is on the standby side of the board (SMC / Southbridge).",
   "links": [
    {
     "label": "Southbridge codes",
     "route": "codes?q=SB"
    }
   ]
  },
  "brickred": {
   "title": "Brick in protection mode",
   "result": "Unplug the DC lead from the console. If the LED returns to orange, the console is pulling a short on the 12 V rail; the board needs diagnosing. If it stays red even after 30 minutes of cooling in open air, the brick itself has failed.",
   "links": [
    {
     "label": "0001 - 12 V short",
     "route": "codes/0001"
    },
    {
     "label": "0002 - CPU Vcore",
     "route": "codes/0002"
    }
   ]
  },
  "greennothing": {
   "title": "12 V is there, the console is silent",
   "result": "The brick is delivering power but nothing boots. Watch the ring or power light closely: a brief red flash means it is failing the self-test, so follow the red light path. Completely dead with a green brick usually means a board fault around the power button or standby rails.",
   "links": [
    {
     "label": "Red ring path",
     "route": "troubleshoot/redring"
    }
   ]
  },
  "redring": {
   "q": "How many quadrants are lit red?",
   "options": [
    {
     "label": "One",
     "next": "r1"
    },
    {
     "label": "Two",
     "next": "heat"
    },
    {
     "label": "Three (the RROD)",
     "next": "r3"
    },
    {
     "label": "Four",
     "next": "r4"
    }
   ]
  },
  "r1": {
   "title": "Hardware error with an E-code",
   "result": "One red light comes with an E-code on the TV. Write it down and convert it: the E-code is just the secondary code written in base 10 (E74 = 1022).",
   "links": [
    {
     "label": "Open the E-code converter",
     "route": "decoder"
    },
    {
     "label": "E74",
     "route": "codes/E74"
    },
    {
     "label": "E68",
     "route": "codes/E68"
    }
   ]
  },
  "r3": {
   "title": "Red Ring of Death",
   "result": "Three red lights is a general hardware failure. Read the secondary code before anything else: hold Sync, tap Eject four times, and count the lit quadrants for each digit. The decoder tells you which part failed. Do not towel-trick or blind-reflow it.",
   "links": [
    {
     "label": "Open the decoder",
     "route": "decoder"
    },
    {
     "label": "Guided reading",
     "route": "decoder?guide=1"
    }
   ]
  },
  "r4": {
   "title": "No AV cable detected",
   "result": "Reseat the AV cable or try another one, and look into the AV port with a torch for bent or pushed-in pins. On HDMI boards try HDMI alone. If several known-good cables all give four lights, the AV port or the HANA scaler is suspect.",
   "links": [
    {
     "label": "HANA codes",
     "route": "codes?q=HANA"
    }
   ]
  },
  "slimred": {
   "q": "Is there an E-code on the TV?",
   "options": [
    {
     "label": "Yes, there is an E-code",
     "next": "ecode"
    },
    {
     "label": "No E-code, it shuts off by itself",
     "next": "heat"
    }
   ]
  },
  "novideo": {
   "q": "What do the console lights show?",
   "options": [
    {
     "label": "Normal green lights, black screen",
     "next": "novid_green"
    },
    {
     "label": "Red lights",
     "next": "redring"
    }
   ]
  },
  "novid_green": {
   "title": "Console running, nothing on the TV",
   "result": "Usually the cable or the display mode. Try another cable and TV input. With a component cable on a Phat, the switch on the plug picks HDTV or TV. If the console was set to a resolution the TV cannot show, connect a composite cable to get a picture and reset the display settings. Still black on every cable with green lights means the video path (HANA / ANA scaler) is suspect.",
   "links": [
    {
     "label": "HANA codes",
     "route": "codes?q=HANA"
    }
   ]
  },
  "ecode": {
   "title": "Convert the E-code",
   "result": "The E-code is the secondary code in base 10. Convert it and look it up: E74 is 1022 (eDRAM / HANA), E68 is 1010 (HDD), E71 is 1013, E73 is 1021.",
   "links": [
    {
     "label": "E-code converter",
     "route": "decoder"
    },
    {
     "label": "E74",
     "route": "codes/E74"
    },
    {
     "label": "E68",
     "route": "codes/E68"
    },
    {
     "label": "E73",
     "route": "codes/E73"
    }
   ]
  },
  "freeze": {
   "q": "When does it freeze?",
   "options": [
    {
     "label": "In every game once warm, often with checkerboard or artifacts",
     "next": "freeze_gpu"
    },
    {
     "label": "Only with one particular disc",
     "next": "disc"
    },
    {
     "label": "Randomly, even on the dashboard, with a hard drive attached",
     "next": "freeze_hdd"
    },
    {
     "label": "After 10 to 30 minutes, with the fan screaming",
     "next": "heat"
    }
   ]
  },
  "freeze_gpu": {
   "title": "GPU or memory joints",
   "result": "Artifacts plus warm-up freezes point at the GPU BGA or the memory chips. On 90nm boards this is the underfill failure behind 0102 and 0110. A reflow buys weeks, a proper reball buys years, and the board revision decides whether it is worth either.",
   "links": [
    {
     "label": "0102",
     "route": "codes/0102"
    },
    {
     "label": "0110",
     "route": "codes/0110"
    },
    {
     "label": "Which board do I have?",
     "route": "identify"
    }
   ]
  },
  "freeze_hdd": {
   "title": "Hard drive",
   "result": "Remove the hard drive and run from a memory unit or USB stick. If the freezes stop, the drive is failing. Back up what you can and replace it.",
   "links": [
    {
     "label": "E68 - HDD",
     "route": "codes/E68"
    }
   ]
  },
  "disc": {
   "q": "What does the drive do?",
   "options": [
    {
     "label": "The tray will not open or close",
     "next": "tray"
    },
    {
     "label": "Plays DVDs but not games, or says unreadable disc / open tray",
     "next": "laser"
    }
   ]
  },
  "tray": {
   "title": "Worn tray belt",
   "result": "The rubber belt that drives the tray stretches and slips. Replacing it is a cheap DIY fix on BenQ and Lite-On drives. While it is open, check the eject button contact and the tray gear.",
   "links": [
    {
     "label": "DVD codes",
     "route": "codes?q=DVD"
    }
   ]
  },
  "laser": {
   "title": "Weak or dirty laser",
   "result": "Clean the lens with 99% isopropyl alcohol first. If it still fails, replace the laser unit, not the whole drive: the drive is paired to the motherboard by its DVD key, so a swapped drive will not read games without the key being transferred.",
   "links": [
    {
     "label": "DVD codes",
     "route": "codes?q=DVD"
    },
    {
     "label": "DVD key",
     "route": "reference/dvd-key"
    }
   ]
  },
  "heat": {
   "title": "Overheating",
   "result": "Let it cool for 30 minutes. Give it at least 10 cm of clearance on every side, never run it on carpet or in a closed cabinet, and blow the dust out of the intake and heatsinks. If it still overheats, check that every fan spins, then replace the thermal paste. On Phats, do not tighten the X-clamps further: it bends the board.",
   "links": [
    {
     "label": "Thermal codes",
     "route": "codes?q=Thermal"
    },
    {
     "label": "X-clamp",
     "route": "reference/x-clamp"
    }
   ]
  }
 },
 "glossary": [
  {
   "term": "RROD",
   "slug": "rrod",
   "def": "Red Ring of Death. Three red quadrants on a Phat: a general hardware failure, overwhelmingly GPU-related on 90nm boards.",
   "aka": [
    "Red Ring of Death"
   ],
   "cat": "diagnosis"
  },
  {
   "term": "Secondary code",
   "slug": "secondary-code",
   "def": "The four-digit code you read by holding Sync and tapping Eject. Each digit is 0-3, so it is the E-code written in base 4.",
   "aka": [
    "secondary error code"
   ],
   "cat": "diagnosis"
  },
  {
   "term": "E-code",
   "slug": "e-code",
   "def": "The error number shown on the TV (E74, E68...). Same value as the secondary code, in base 10.",
   "aka": [],
   "cat": "diagnosis"
  },
  {
   "term": "BGA",
   "slug": "bga",
   "def": "Ball Grid Array. Chips like the CPU, GPU and memory sit on a grid of solder balls instead of legs, which crack under repeated heat cycles.",
   "aka": [
    "ball grid array"
   ],
   "cat": "repair"
  },
  {
   "term": "Reflow",
   "slug": "reflow",
   "def": "Heating a BGA chip until its solder balls re-melt to reconnect cracked joints. Usually temporary on a 360, because the original solder and underfill are still there.",
   "aka": [
    "reflowing"
   ],
   "cat": "repair"
  },
  {
   "term": "Reball",
   "slug": "reball",
   "def": "Removing the chip, cleaning the pads and fitting new solder balls. The proper fix for a joint failure, but it cannot cure a failure inside the chip package.",
   "aka": [
    "reballing"
   ],
   "cat": "repair"
  },
  {
   "term": "Underfill",
   "slug": "underfill",
   "def": "The epoxy under the GPU die. Launch 90nm GPUs used a low-Tg underfill that softens with heat, letting the bumps between die and substrate crack: a fault inside the package.",
   "aka": [],
   "cat": "hardware"
  },
  {
   "term": "Tg",
   "slug": "tg",
   "def": "Glass transition temperature: where an epoxy goes from rigid to rubbery. High-Tg underfill on the 80nm Rhea GPU is a big part of why Late Falcon fixed the RROD.",
   "aka": [
    "glass transition"
   ],
   "cat": "hardware"
  },
  {
   "term": "X-clamp",
   "slug": "x-clamp",
   "def": "The X-shaped spring clamps that hold the Phat CPU and GPU heatsinks. The old \"X-clamp fix\" swapped them for screws and washers and usually made things worse by bending the board.",
   "aka": [
    "X-clamps",
    "x clamp"
   ],
   "cat": "repair"
  },
  {
   "term": "IHS",
   "slug": "ihs",
   "def": "Integrated Heat Spreader: the metal lid over a processor die. Winchester is the only 360 board without one.",
   "aka": [
    "heat spreader"
   ],
   "cat": "hardware"
  },
  {
   "term": "CGPU",
   "slug": "cgpu",
   "def": "The single 45nm chip on S and E boards that combines CPU, GPU and eDRAM (Vejle). It runs far cooler than the separate Phat chips.",
   "aka": [
    "Vejle"
   ],
   "cat": "hardware"
  },
  {
   "term": "eDRAM",
   "slug": "edram",
   "def": "The 10 MB embedded memory die next to the GPU, used for the frame buffer. A classic E74 source on Phats.",
   "aka": [],
   "cat": "hardware"
  },
  {
   "term": "HANA",
   "slug": "hana",
   "def": "The video scaler / HDMI encoder chip (ANA on the earliest boards). Corona folded it into the Southbridge.",
   "aka": [
    "ANA"
   ],
   "cat": "hardware"
  },
  {
   "term": "Southbridge",
   "slug": "southbridge",
   "def": "The I/O hub: USB, SATA, audio, networking and the SMC all live behind it.",
   "aka": [
    "SB"
   ],
   "cat": "hardware"
  },
  {
   "term": "SMC",
   "slug": "smc",
   "def": "System Management Controller, inside the Southbridge. Runs power sequencing, fans, temperatures and the Ring of Light. RGH 3 reprograms it.",
   "aka": [],
   "cat": "hardware"
  },
  {
   "term": "Vcore",
   "slug": "vcore",
   "def": "The core voltage rail of the CPU or GPU. A shorted Vcore shows up as codes like 0002 and 0003.",
   "aka": [],
   "cat": "hardware"
  },
  {
   "term": "NAND",
   "slug": "nand",
   "def": "The flash chip holding the bootloaders, keyvault and config. Always dump it twice and compare before modding.",
   "aka": [
    "flash"
   ],
   "cat": "modding"
  },
  {
   "term": "Keyvault",
   "slug": "keyvault",
   "def": "Console-unique encrypted block in the NAND: console certificate, DVD key and more. Never share it.",
   "aka": [
    "KV"
   ],
   "cat": "modding"
  },
  {
   "term": "CPU key",
   "slug": "cpu-key",
   "def": "A per-console key fused into the CPU, needed to decrypt the keyvault. JTAG and RGH are how you read it out.",
   "aka": [],
   "cat": "modding"
  },
  {
   "term": "DVD key",
   "slug": "dvd-key",
   "def": "The key pairing a disc drive to its motherboard. Swap the drive and it will not read games until the key is transferred.",
   "aka": [],
   "cat": "modding"
  },
  {
   "term": "eFuse",
   "slug": "efuse",
   "def": "One-time fuses in the CPU. Dashboard updates burn them so older, exploitable bootloaders can no longer run.",
   "aka": [
    "eFuses"
   ],
   "cat": "modding"
  },
  {
   "term": "JTAG",
   "slug": "jtag",
   "def": "The SMC / JTAG hack: an exploit through the debug port that only works on consoles whose kernel never went past 2.0.7371.",
   "aka": [
    "SMC hack"
   ],
   "cat": "modding"
  },
  {
   "term": "RGH",
   "slug": "rgh",
   "def": "Reset Glitch Hack. A timed pulse on the CPU reset line makes the bootloader hash check pass. RGH1 and RGH2 use a glitch chip; RGH 3 does it with the SMC alone.",
   "aka": [
    "RGH1",
    "RGH2",
    "RGH 3",
    "reset glitch"
   ],
   "cat": "modding"
  },
  {
   "term": "Glitch chip",
   "slug": "glitch-chip",
   "def": "The small CPLD board (CR4, Matrix, X360ACE...) that generates the reset pulse for RGH1 and RGH2.",
   "aka": [
    "CPLD"
   ],
   "cat": "modding"
  },
  {
   "term": "BadUpdate",
   "slug": "badupdate",
   "def": "A software-only, non-persistent hypervisor exploit for dashboard 17559 that works on every board, Winchester included.",
   "aka": [],
   "cat": "modding"
  },
  {
   "term": "Phat",
   "slug": "phat",
   "def": "The original 2005-2010 console with the four-quadrant Ring of Light.",
   "aka": [
    "Fat"
   ],
   "cat": "models"
  },
  {
   "term": "Slim",
   "slug": "slim",
   "def": "The Xbox 360 S (2010), with a glossy or matte shell and a touch power button. Boards: Trinity, then Corona.",
   "aka": [
    "360 S"
   ],
   "cat": "models"
  },
  {
   "term": "Towel trick",
   "slug": "towel-trick",
   "def": "Wrapping a dead console so it overheats until joints re-melt. It cooks everything else too. Do not.",
   "aka": [],
   "cat": "repair"
  }
 ],
 "timeline": [
  {
   "date": "2005-11",
   "kind": "board",
   "label": "Xbox 360 launches on Xenon",
   "board": "xenon"
  },
  {
   "date": "2006-09",
   "kind": "board",
   "label": "Zephyr adds HDMI",
   "board": "zephyr"
  },
  {
   "date": "2007-07",
   "kind": "event",
   "label": "Microsoft extends the RROD warranty to 3 years"
  },
  {
   "date": "2007-08",
   "kind": "board",
   "label": "Falcon: 65nm CPU, 175 W brick",
   "board": "early-falcon"
  },
  {
   "date": "2008-05",
   "kind": "board",
   "label": "Late Falcon: 80nm Rhea GPU, high-Tg underfill",
   "board": "late-falcon-v2"
  },
  {
   "date": "2008-09",
   "kind": "board",
   "label": "Jasper: 65nm GPU, 150 W brick",
   "board": "jasper"
  },
  {
   "date": "2009-08",
   "kind": "hack",
   "label": "Dashboard update closes the JTAG hack (needs kernel 7371 or lower)"
  },
  {
   "date": "2009-09",
   "kind": "board",
   "label": "Tonasket / Kronos: 65nm eDRAM",
   "board": "tonasket-kronos"
  },
  {
   "date": "2010-06",
   "kind": "board",
   "label": "Xbox 360 S on Trinity, one-chip CGPU",
   "board": "trinity"
  },
  {
   "date": "2011-08",
   "kind": "hack",
   "label": "Reset Glitch Hack (RGH1) released"
  },
  {
   "date": "2011-08",
   "kind": "board",
   "label": "Corona: HANA folded into the Southbridge",
   "board": "corona-v1-v6"
  },
  {
   "date": "2011-11",
   "kind": "hack",
   "label": "RGH2 brings the glitch to the Slim"
  },
  {
   "date": "2013-06",
   "kind": "board",
   "label": "Xbox 360 E launches (Corona)",
   "board": "corona-v1-v6"
  },
  {
   "date": "2014-01",
   "kind": "board",
   "label": "Winchester: no IHS, coolest board",
   "board": "winchester"
  },
  {
   "date": "2016-04",
   "kind": "event",
   "label": "Production ends"
  },
  {
   "date": "2021-11",
   "kind": "hack",
   "label": "RGH 3: glitch with the SMC, no chip"
  },
  {
   "date": "2025-03",
   "kind": "hack",
   "label": "BadUpdate: software-only, every board"
  }
 ]
};
