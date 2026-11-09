---
title: Dive and Catch Design
date: 2026-11-09
tags: [roblox, game-design, gameplay, diving]
---

# Dive and Catch Design

The dive is what separates this game from menu-only "Steal a ___" clones, so it has to be fun on its own. Starting values; tune in playtests.

## Session shape
Target 2-4 minutes per dive: leave the beach, swim to a zone, catch 2-6 creatures, return. Short enough for mobile players, long enough to feel like a trip.

## Movement
- Swim with free 3D movement; a boost burns oxygen faster.
- Scuba tiers: free swimming. Subs: pilot a vehicle with a lighter, momentum-based feel; the player can exit to catch.
- Surface button ("Ascend") returns you toward the beach; ascent takes real time, so deeper zones mean longer returns.

## Oxygen and failure
- Oxygen drains steadily, faster when boosting or carrying more cargo.
- Running out triggers a **blackout**: you wake on the beach and lose half your uncaught cargo (never your base). Never a hard punishment; it just means a wasted trip.
- Sub battery is the equivalent for subs; recharge on the beach pad.

## Catching
- **Approach:** creatures have awareness; loud movement (boosting) spooks them, quiet drifting lets you get close.
- **Catch:** hold interact to start a timing bar; the bar speed and target size scale with rarity.
- **Net tool** upgrades widen the catch window; **lure** items attract specific rarities.
- Failing a catch costs a few seconds and spooks the creature, never a life.

## Creature behavior (simple, cheap)
- Common: schools, easy to approach.
- Rare and up: flee when seen, hide near landmarks, may only appear at certain times (night, tide).
- Predator creatures (anglerfish, sharks) roam and are a hazard, not a catch, until subdued.

## Spawning
- Shared per-server spawns with timers, so players compete for the good ones.
- A server-wide chime when a Legendary or Mythic spawns: creates excitement and gives a reason to dive now.
- Respawn timers per zone keep it from running dry.

## Cargo
- Capped by gear tier. A full hold is the cue to return.
- Cargo carried is visible to others in the water (a glow or trail), which is what makes piracy tempting later.

Related: [Core Loop and Systems](Core-Loop-and-Systems.md), [First Two Zones](First-Two-Zones.md), [Sub Tier Ladder](Sub-Tier-Ladder.md)
Up: [Home](INDEX.md)
