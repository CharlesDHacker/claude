---
title: Raid and Lock Design
date: 2026-11-09
tags: [roblox, game-design, stealing, balance]
---

# Raid and Lock Design

Starting values; tune in playtests. All checks are **server-side**.

## Base layout
Beach with one plot per player, 12-16 plots per server. Each plot has tanks (2-3 at start, up to 12) with a gate. Plots sit along the shore so players can see each other.

## Locking
- Owner buys a **Lock** (timed): 60 s base, upgrades to 5 min, up to 15 min late game. Costs in-game currency, scaling with the value of the base.
- While locked, tanks cannot be touched. When the lock expires the tanks are vulnerable.
- **Dive Shield:** while the owner is underwater, their base has a short automatic shield after leaving the beach (about 20 s) so nobody is robbed the instant they dive.

## Raiding
- A raider walks to a tank, holds interact for 2-3 s (a visible progress bar, owner gets an alarm ping), and takes **one creature per raid** from an unlocked tank.
- Cannot raid while carrying a stolen creature. Must return to their own base to deposit it, or the owner can tag them and recover it.
- Raider can be **tagged** by the owner (tag tool, or a guard creature) and the creature returns to its tank.
- Raid cooldown per raider (about 30 s) and a per-victim cap (max 3 raids per 10 minutes) so one player is not farmed.

## Anti-grief rules
- **Newcomer protection:** first 20 minutes of play are raid-proof.
- **Loss floor:** a base can never lose its last creature, and rare finds (Legendary+) are protected for 2 minutes after catching.
- **Insurance:** stolen creatures are logged; the owner gets 25% of its value back as consolation currency.
- **Guard creatures** (earned or bought) defend a tank; stronger guards go in deeper-tier tanks.

## Raid counterplay (so it is not just luck)
- Alarm ping, tag-back, guard creatures, and positioning your tanks.
- Optional later: a co-op raid mini-puzzle (cut a net, open a vault) for higher-value targets.

## Later: sub piracy
Only applies to cargo in transit on the return trip. Hijack requires ramming plus a short hold; the victim keeps the sub but loses the cargo. Limit to deeper zones and opt-in "pirate waters".

Related: [Core Loop and Systems](Core-Loop-and-Systems.md), [Monetization and Tech Notes](Monetization-and-Tech-Notes.md), [Decisions Log](Decisions-Log.md)
Up: [Home](INDEX.md)
