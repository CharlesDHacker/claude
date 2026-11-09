# Reef Raiders

Roblox game built with [Rojo](https://rojo.space). Design notes live in the `ocean-game` vault folder.

## Development
1. Install the toolchain: `rokit install`
2. Start syncing: `rojo serve`
3. In Roblox Studio, connect with the Rojo plugin.

## Structure
- `src/shared` -> ReplicatedStorage/Shared: types, config, creature and sub catalogs, pure rules
- `src/server` -> ServerScriptService/Server: authoritative systems (raids, economy)
- `src/client` -> StarterPlayerScripts/Client: input, HUD

## Checks
- Format: `stylua src`
- Lint: `selene src`

## Status
Scaffold only. Raid validation and economy math are written as pure shared modules so they can be unit tested; data persistence is a TODO (ProfileStore, see roblox-datastores).
