--!strict
-- Tunable gameplay values (replicated to clients; nothing secret here).
-- The server never trusts a client-reported value from this file.

return table.freeze({
	AUTOSAVE_INTERVAL = 60,

	-- Raid rules (see Raid-and-Lock-Design in the vault)
	NEWCOMER_PROTECTION_SECONDS = 20 * 60,
	RAID_COOLDOWN_SECONDS = 30,
	MAX_RAIDS_PER_VICTIM = 3,
	RAID_WINDOW_SECONDS = 10 * 60,
	RAID_HOLD_SECONDS = 2.5,
	MAX_RAID_DISTANCE = 12,
	INSURANCE_FRACTION = 0.25,
})
