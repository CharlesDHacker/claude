--!strict
-- Pure economy math: easy to unit test, no Roblox services.
local Creatures = require(script.Parent.Parent.Creatures)
local Types = require(script.Parent.Parent.Types)

local INCOME_PER_SECOND: { [Types.Rarity]: number } = {
	Common = 1,
	Uncommon = 5,
	Rare = 25,
	Epic = 150,
	Legendary = 1000,
	Mythic = 7500,
}

local Economy = {}

function Economy.incomePerSecond(creatureId: string, mutationMultiplier: number?): number
	local def = Creatures.get(creatureId)
	if not def then
		return 0
	end
	return INCOME_PER_SECOND[def.rarity] * (mutationMultiplier or 1)
end

-- Rough value used for insurance payouts (about ten minutes of income).
function Economy.valueOf(creatureId: string): number
	return Economy.incomePerSecond(creatureId) * 600
end

return Economy
