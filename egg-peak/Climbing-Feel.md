---
title: Climbing Feel
date: 2026-11-22
tags: [roblox, game-design, animation, egg-peak]
---

# Climbing Feel

The stock Roblox climb is a generic ladder shimmy. Egg Peak's climb should read as *hauling yourself up a frozen mountain*, and change with the game's own systems.

**Layered on top of the base climb clip** (`game/src/client/Climb/ClimbAnimator.luau`, tunables in `ClimbConfig.luau`):

| Game state | What the player sees |
|---|---|
| Moving | Clip cadence follows real speed; hips swing toward the planted hand; head tips up to the next hold |
| Stopped | Clip freezes into a hang with slow breathing |
| Each grip | Ice chips off the hand, small camera dip, optional sound per surface (ice, glacier, snow, rock) |
| Carrying an egg | Slower, heavier cadence, hugs the wall, harder breathing, bigger chips and camera dip |
| Cold meter (Blizzard Peak) | Shiver grows with `Cold`, 0 to 1 |

Server sets character attributes `CarryingEgg`, `Cold`, `Heat`; the client only reads them. Ties into [NPC Chasers](NPC-Chasers.md) (Heat) and [Mountain Zones](Mountain-Zones.md) (ice caves, blizzard peak).

**Swapping in a custom clip:** change `BASE_ANIMATION_ID`. Everything else keeps working, since it follows the clip's phase.

**Ideas not built yet:** ice-axe pick for the ice caves (rope and headlamp gate), egg bobbing on the back, slip-and-catch animation when Heat is high, per-season grip sounds.

Up: [Home](INDEX.md)
