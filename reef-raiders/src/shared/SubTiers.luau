--!strict
-- Gear and sub ladder. Starting values to tune in playtests.
local Types = require(script.Parent.Types)

local tiers: { Types.SubTier } = {
	{ tier = 0, name = "Snorkel and Fins", maxDepth = 10, oxygenSeconds = 30, cargo = 2, price = 0, unlocks = { "SeagrassFlats" } },
	{ tier = 1, name = "Scuba Starter", maxDepth = 30, oxygenSeconds = 60, cargo = 3, price = 500, unlocks = { "CoralReef", "Mangroves" } },
	{ tier = 2, name = "Scuba Pro", maxDepth = 50, oxygenSeconds = 120, cargo = 4, price = 5000, unlocks = { "KelpForest", "Shipwrecks" } },
	{ tier = 3, name = "Dive Pod", maxDepth = 120, oxygenSeconds = 180, cargo = 6, price = 50000, unlocks = { "Caves", "UpperTwilight" } },
	{ tier = 4, name = "Explorer Sub", maxDepth = 300, oxygenSeconds = 300, cargo = 10, price = 500000, unlocks = { "TwilightZone", "WhaleFall" } },
	{ tier = 5, name = "Thermal Sub", maxDepth = 600, oxygenSeconds = 360, cargo = 14, price = 5000000, unlocks = { "VolcanicVents" } },
	{ tier = 6, name = "Abyss Sub", maxDepth = 1200, oxygenSeconds = 480, cargo = 20, price = 50000000, unlocks = { "AbyssalPlains" } },
	{ tier = 7, name = "Trench Sub", maxDepth = 2000, oxygenSeconds = 600, cargo = 30, price = 500000000, unlocks = { "MarianaTrench" } },
}

local SubTiers = {}

function SubTiers.get(tier: number): Types.SubTier?
	return tiers[tier + 1]
end

function SubTiers.canReach(tier: number, depth: number): boolean
	local def = SubTiers.get(tier)
	return def ~= nil and depth <= def.maxDepth
end

SubTiers.all = tiers

return SubTiers
