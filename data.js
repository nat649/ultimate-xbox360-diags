/* Auto-generated dataset for the 360 Diagnostic Wiki. Edit here, the UI reads it. */
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
   "tier": "F"
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
   "tier": "F"
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
   "tier": "C"
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
   "tier": "A"
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
   "tier": "B"
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
   "tier": "S"
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
   "tier": "S+"
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
   "tier": "S"
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
   "tier": "A"
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
   "tier": "S+"
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
 "psuNote": "The three phat generations use differently keyed connectors and are not freely interchangeable - match the wattage printed on the brick to the board rather than assuming a plug that physically enters is the right one. Slim and E consoles use a smaller connector of their own, so there is no crossover with the phats at all."
};
