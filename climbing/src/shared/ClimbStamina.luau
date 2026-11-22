--!strict
-- Pure grip/stamina logic. No Roblox services, so it is unit-testable.

local Config = require(script.Parent.ClimbConfig)

export type TierName = "Strong" | "Tiring" | "Shaky" | "Spent"

local Stamina = {}
Stamina.__index = Stamina

export type Stamina = typeof(setmetatable({} :: { value: number, max: number }, Stamina))

function Stamina.new(max: number?): Stamina
	local m = max or Config.GRIP_MAX
	return setmetatable({ value = m, max = m }, Stamina)
end

function Stamina.fraction(self: Stamina): number
	return self.value / self.max
end

function Stamina.drain(self: Stamina, amount: number)
	self.value = math.max(0, self.value - amount)
end

function Stamina.regen(self: Stamina, amount: number)
	self.value = math.min(self.max, self.value + amount)
end

-- Returns false (and changes nothing) if there is not enough grip.
function Stamina.spend(self: Stamina, cost: number): boolean
	if self.value < cost then
		return false
	end
	self.value -= cost
	return true
end

-- Returns tier name, speed multiplier, shake intensity (0-1).
function Stamina.tier(self: Stamina): (TierName, number, number)
	if self.value <= 0 then
		return "Spent", 0, 1
	end
	local f = self:fraction()
	for _, t in Config.TIERS do
		if f >= t.from then
			return t.name :: TierName, t.speed, t.shake
		end
	end
	return "Shaky", 0.5, 1
end

return Stamina
