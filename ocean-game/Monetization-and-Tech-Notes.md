---
title: Monetization and Tech Notes
date: 2026-11-09
tags: [roblox, monetization, security, performance]
---

# Monetization and Tech Notes

## Monetization (keep it fair)
- Safe: luck boosts, extra tank slots, sub skins, lock upgrades, cosmetics.
- Avoid selling depth gates directly for Robux; progression loses meaning.

## Technical
- **Server-authoritative** currency, inventory and steal validation from day one; these games attract exploiters (skill: roblox-security).
- **Player data:** retry/backoff, session locking, autosaves (skill: roblox-datastores).
- **Architecture:** ModuleScripts, client/server/shared layout, Rojo-friendly (skill: roblox-architecture, roblox-dev:setup).
- **Performance:** stream zones or keep them as separate areas so mobile is not hurt (skill: roblox-performance).
- **UI:** responsive scaling for phones (skill: roblox-ui).

Related: [Core Loop and Systems](Core-Loop-and-Systems.md), [MVP and Roadmap](MVP-and-Roadmap.md)
Up: [Home](INDEX.md)
