---
title: NPC Chasers
date: 2026-11-09
tags: [roblox, game-design, npcs, chase, egg-peak]
---

# NPC Chasers

NPC skiers chase players who are carrying an egg, scaling with the zone you are in. This makes every trip skill-based, not only raids.

## When they chase
- **Egg Heat meter:** carrying an egg (found or stolen) raises Heat. Higher heat means NPCs notice you sooner and chase harder.
- Empty-handed players are ignored, so exploring is safe.
- Stolen eggs add more heat than found eggs, so raiders face the toughest chase.

## Chasers by zone
| Zone | NPC | Behavior | Difficulty |
|---|---|---|---|
| Base village | Ski Patrol Rookie | Slow, shouts a warning first | Very easy; a tutorial chaser |
| Pine forest | Park Ranger | Medium speed, cuts through trees | Easy |
| Frozen lake | Ice Fisher | Slows you with thrown snowballs on ice | Medium |
| Ice caves | Cave Warden | Fast in tunnels, weak outside them | Medium |
| Summit lodge | Patrol Captain | Fast, uses jumps and shortcuts | Hard |
| Blizzard peak | Yeti Hunter / Yeti | Very fast but hurt by warmth items; drops back in sunlight/near fires | Hardest |

## What happens on a catch
- You are tagged: the egg is dropped and returns to the **nearest hatchery post** (found eggs) or **the victim's incubator** (stolen eggs), never destroyed.
- You are knocked back a short distance and cannot be re-tagged by the same NPC for a few seconds.
- A found egg dropped on the mountain can be picked up by another player, so a catch has social consequences.

## Fairness and counterplay
- NPCs telegraph: a warning shout, an exclamation mark, and a short delay before the chase begins.
- Ways to escape: hide in trees or snow banks, lose them over jumps, reach a safe zone (a lodge door or a ranger hut), or use consumables (smoke, decoy egg, ice patch).
- **Caps and cooldowns:** a limited number of NPCs per player at once, and an NPC cooldown after a catch so you are not chain-tagged.
- Heat decays when you stop moving fast or enter a safe area.

## Owner-side NPCs
Players can hire a **lodge patrol skier** as a defense that chases raiders. It is slower than a player and only chases within the lodge's zone of the mountain, so skilled raiders can outrun it.

## Seasonal twist
NPC outfits and behavior change per season (mud rangers in spring, summer lifeguard-style patrol, autumn scarecrow chasers), but the stats stay the same.

## Performance notes (for later, not code)
Keep NPC counts low per player, use simple slope-following chase paths instead of full pathfinding, and despawn NPCs when no egg carrier is nearby.

Related: [Raid and Defense Design](Raid-and-Defense-Design.md), [Mountain Zones](Mountain-Zones.md), [Seasons and Events](Seasons-and-Events.md)
Up: [Home](INDEX.md)
