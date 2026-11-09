---
title: Sub Tier Ladder
date: 2026-11-09
tags: [roblox, game-design, progression, economy]
---

# Sub Tier Ladder

All numbers are **starting values to tune in playtests**, not final.

## Gear and sub tiers
| # | Gear | Max depth | Oxygen / battery | Cargo | Price | Unlocks |
|---|---|---|---|---|---|---|
| 0 | Snorkel and fins | 10 m | 30 s | 2 | Free | Seagrass flats |
| 1 | Scuba Starter | 30 m | 60 s | 3 | 500 | Coral reef, mangroves |
| 2 | Scuba Pro | 50 m | 120 s | 4 | 5k | Kelp forest, shipwrecks |
| 3 | Dive Pod (first sub) | 120 m | 3 min | 6 | 50k | Caves, upper twilight |
| 4 | Explorer Sub (+ headlights) | 300 m | 5 min | 10 | 500k | Twilight zone, whale fall |
| 5 | Thermal Sub (heat resistant) | 600 m | 6 min | 14 | 5M | Volcanic vents |
| 6 | Abyss Sub | 1,200 m | 8 min | 20 | 50M | Abyssal plains |
| 7 | Trench Sub | 2,000 m+ | 10 min | 30 | 500M | Mariana trench |
| E | Event subs (Ice Breaker, Atlantis Sub, Time Sub) | varies | varies | varies | event / Robux skin only | Arctic, Atlantis, prehistoric |

Rule of thumb: about 10x price per tier, tuned so the first full haul in the previous zone pays back roughly a tier in 10-15 minutes of play early, stretching to hours later.

## Creature income (per second, while placed in base)
| Rarity | Income/s | Example spawn |
|---|---|---|
| Common | 1 | Clownfish |
| Uncommon | 5 | Sea turtle |
| Rare | 25 | Reef shark |
| Epic | 150 | Anglerfish |
| Legendary | 1,000 | Giant squid |
| Mythic | 7,500 | Megalodon |

Mutations multiply income (for example golden x2, glowing x3, albino x5), at low odds.

## Design rules
- Sub tier gates **access**, never raw income; deeper zones only raise the *odds* of better creatures.
- Every sub stat matters for something different (depth for zones, battery for trip length, cargo for haul size, light for dark zones, heat resistance for vents) so players have real choices.
- Cargo is capped, so a bigger sub means more per trip, and a bigger target for piracy.
- Do not sell tiers 3-7 directly for Robux. Sell skins, luck, extra slots, and a one-time skip token that still needs the depth rating.

Related: [Core Loop and Systems](Core-Loop-and-Systems.md), [Zones and Depth Ladder](Zones-and-Depth-Ladder.md), [Monetization and Tech Notes](Monetization-and-Tech-Notes.md)
Up: [Home](INDEX.md)
