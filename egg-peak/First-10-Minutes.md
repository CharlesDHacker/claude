---
title: First 10 Minutes
date: 2026-11-09
tags: [roblox, game-design, onboarding, retention, egg-peak]
---

# First 10 Minutes

Goal: a brand-new player understands the whole loop (find egg, carry home, warm it, hatch, earn, upgrade) and leaves with a reason to come back. Starting values; tune in playtests.

## Principles
- **Do, don't read:** one short line of text per step, then the player acts.
- **Can't fail the first loop:** the first egg can't be lost; a catch just hands it back.
- **Fast first reward:** first hatch within about 4 minutes.
- **Mobile first:** big buttons, one-thumb steering, no tiny text.
- **Skippable and replayable:** an experienced player can skip steps; the guide is always available.
- **Raid-proof until the 20-minute mark** (see [Raid and Defense Design](Raid-and-Defense-Design.md)), so a new player is never robbed mid-tutorial.

## Guide character
**Pip**, a friendly ski-patrol rookie, hands you your skis and doubles as the first (and gentlest) NPC chaser. See [NPC Chasers](NPC-Chasers.md).

## Timeline
| Time | Beat | What the player learns |
|---|---|---|
| 0:00 | Spawn inside a cozy lodge: fire crackling, empty incubator glowing. Pip gives you skis. | The lodge is home |
| 0:30 | Ski down a tiny practice ramp behind the lodge. | Skiing controls, safe and fun |
| 1:00 | Bunny slope: a free glowing egg sits on a stump. Pick it up. | Eggs are the goal |
| 1:30 | Pip yells playfully and chases slowly; a hint says "Ski home!" If caught, the egg returns and Pip hands it back with a joke. | Egg Heat and chases, with no penalty |
| 2:30 | Back at the lodge, place the egg in the incubator. A cold-egg hint points at the fireplace; moving it close to the fire starts hatching. | Warmth matters, layout matters |
| 3:00 | 30-second hatch timer, with a visible countdown and cracking animation. | Hatching takes time (the retention hook) |
| 3:30 | **First hatch:** guaranteed Uncommon pet (a fox kit) with a big reveal and sound. | The payoff |
| 4:00 | The pet earns coins; tap the coin jar to collect. | Passive income |
| 4:30 | Buy a second incubator and a Common shop egg with those coins. | Spend and reinvest |
| 5:30 | Open the collection log: first pet is logged, the rest are silhouettes. | Collecting is the long-term goal |
| 6:30 | Buy cheap winter boots; the Pine forest gate opens. | Gear unlocks zones |
| 7:00 | First trip to the Pine forest. The Park Ranger telegraphs with a shout and an exclamation mark. Escape, or get tagged and the egg returns. | Zone danger scales |
| 8:30 | Return, incubate a 5-minute Uncommon egg. | A reason to return |
| 9:00 | Pop-ups, one at a time: "Raids start at minute 20. Buy a lock to protect your lodge." Visit prompt for another player's lodge. | Stealing exists; social layer |
| 9:30 | Daily quest appears ("Hatch 3 eggs"), plus a teaser: "Frozen Lake needs ice skates." | Next goals |
| 10:00 | Free session-end reward: a lucky egg that hatches in 5 minutes. | Come back soon |

## Return hooks at the end
- The 5-minute Uncommon egg and the lucky egg are already incubating.
- Daily quest and daily reward.
- A visible next gear goal (ice skates) with its price.
- Offline earnings shown on return.

## Edge cases
- **Idle new player:** after 20 seconds of inactivity, Pip nudges the next step with an arrow.
- **Skip:** an "I know how to play" option gives a starter egg and lodge, then skips ahead.
- **Returning players:** the tutorial never replays; Pip stays as an optional helper.
- **Disconnect:** save progress after each major beat.

## Things to avoid
- Long cutscenes, text walls, forced waiting beyond 30 seconds at the start, any chance of losing the first egg, selling anything before the first hatch.

## Metrics to watch (once live)
- Time to first hatch, tutorial completion rate, day-1 and day-7 return, drop-off by beat, percent who buy a second incubator, percent who reach the Pine forest.

Related: [Eggs and Incubation](Eggs-and-Incubation.md), [NPC Chasers](NPC-Chasers.md), [Progression and Prestige](Progression-and-Prestige.md), [Open Questions](Open-Questions.md)
Up: [Home](INDEX.md)
