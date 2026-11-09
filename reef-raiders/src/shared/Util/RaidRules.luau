--!strict
-- Pure raid validation. The server calls this; it never trusts the client.
local Config = require(script.Parent.Parent.Config)
local Types = require(script.Parent.Parent.Types)

export type Result = { ok: boolean, reason: string? }

local RaidRules = {}

local function fail(reason: string): Result
	return { ok = false, reason = reason }
end

function RaidRules.canRaid(
	raider: Types.PlayerState,
	victim: Types.PlayerState,
	tank: Types.Tank,
	now: number
): Result
	if raider.userId == victim.userId then
		return fail("own_base")
	end
	if tank.ownerId ~= victim.userId then
		return fail("wrong_owner")
	end
	if tank.creatureId == nil then
		return fail("empty_tank")
	end
	if raider.carrying ~= nil then
		return fail("already_carrying")
	end
	if now - raider.joinedAt < Config.NEWCOMER_PROTECTION_SECONDS then
		return fail("raider_is_newcomer")
	end
	if now - victim.joinedAt < Config.NEWCOMER_PROTECTION_SECONDS then
		return fail("victim_protected")
	end
	if now < tank.lockedUntil then
		return fail("locked")
	end
	if now - raider.lastRaidAt < Config.RAID_COOLDOWN_SECONDS then
		return fail("cooldown")
	end

	local recent = 0
	for _, timestamp in victim.raidsReceived do
		if now - timestamp <= Config.RAID_WINDOW_SECONDS then
			recent += 1
		end
	end
	if recent >= Config.MAX_RAIDS_PER_VICTIM then
		return fail("victim_raid_cap")
	end

	return { ok = true }
end

return RaidRules
