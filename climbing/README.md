# Climbing (99 Nights style)

Drop-in mechanics + polish layered on Roblox's Humanoid `Climbing` state, so your
existing climb animation keeps working (track name must contain "climb").

Mechanics: grip drain, fatigue tiers, slip-off lockout, lunge (LeftShift / X / touch),
ledge mantle, **noise that monsters can hear**.
Polish: camera lean/shake/FOV punch, dust puffs, grip bar, sound hooks (fill `SOUNDS` in `ClimbConfig`).

## Hooks for the rest of the game
- Set character attribute `ClimbLoad = true` when carrying something heavy, `Cold = true` when freezing.
- Enemy AI: read `ClimbNoise` (radius, studs) and `ClimbNoiseTime` (`os.clock()` of the server) on a character
  to decide whether it heard the climber.

## Install
`rojo serve default.project.json`, or copy `src/shared`, `src/server`, `src/client` into Studio
(ReplicatedStorage.ClimbShared, ServerScriptService.ClimbServer, StarterPlayerScripts.ClimbClient).

Untested in Studio: tune numbers in `ClimbConfig.luau`.
