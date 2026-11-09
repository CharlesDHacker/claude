--!strict
-- Creature catalog for the two MVP zones. Income is derived from rarity.
local Types = require(script.Parent.Types)

local list: { Types.CreatureDef } = {
	{ id = "clownfish", name = "Clownfish", rarity = "Common", zone = "CoralReef" },
	{ id = "damselfish", name = "Damselfish", rarity = "Common", zone = "CoralReef" },
	{ id = "sea_turtle", name = "Sea Turtle", rarity = "Uncommon", zone = "CoralReef" },
	{ id = "manta_ray", name = "Manta Ray", rarity = "Rare", zone = "CoralReef" },
	{ id = "reef_shark", name = "Reef Shark", rarity = "Epic", zone = "CoralReef" },
	{ id = "seahorse_king", name = "Seahorse King", rarity = "Legendary", zone = "CoralReef" },
	{ id = "lanternfish", name = "Lanternfish", rarity = "Common", zone = "TwilightZone" },
	{ id = "glow_jelly", name = "Glowing Jellyfish", rarity = "Uncommon", zone = "TwilightZone" },
	{ id = "vampire_squid", name = "Vampire Squid", rarity = "Rare", zone = "TwilightZone" },
	{ id = "anglerfish", name = "Anglerfish", rarity = "Epic", zone = "TwilightZone" },
	{ id = "giant_squid", name = "Giant Squid", rarity = "Legendary", zone = "TwilightZone" },
	{ id = "ghost_whale", name = "Ghost Whale", rarity = "Mythic", zone = "TwilightZone" },
}

local byId: { [string]: Types.CreatureDef } = {}
for _, def in list do
	byId[def.id] = def
end

local Creatures = {}

Creatures.all = list

function Creatures.get(id: string): Types.CreatureDef?
	return byId[id]
end

return Creatures
