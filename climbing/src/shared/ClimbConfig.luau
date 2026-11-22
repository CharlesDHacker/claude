--!strict
-- Tunable climbing values for 99 Nights style survival climbing
-- (trees, cliffs, ladders). Starting numbers: tune in playtests.

return table.freeze({
	-- Grip (stamina) --------------------------------------------------------
	GRIP_MAX = 100,
	CLIMB_DRAIN = 7, -- per second while moving
	HANG_DRAIN = 2.5, -- per second while hanging still
	-- Surfaces that wear your grip out faster (wet rock, mud, moss...)
	SLIPPERY_MATERIALS = { "Mud", "Slate", "Ice", "Glacier", "Snow" },
	SLIPPERY_DRAIN_MULT = 1.8,
	-- Character attributes other systems can set (all optional):
	--   "ClimbLoad" (boolean): carrying something heavy (logs, scrap, a rescued kid)
	--   "Cold" (boolean): freezing fingers at night / in the snow biome
	LOAD_DRAIN_MULT = 1.5,
	LOAD_SPEED_MULT = 0.85,
	COLD_DRAIN_MULT = 1.35,
	GROUND_REGEN = 25, -- per second, only while standing
	REGRAB_FRACTION = 0.35, -- after a slip, need this much grip AND solid ground

	-- Fatigue tiers: from = minimum grip fraction, speed = climb speed multiplier
	TIERS = {
		{ name = "Strong", from = 0.5, speed = 1.0, shake = 0 },
		{ name = "Tiring", from = 0.2, speed = 0.8, shake = 0.25 },
		{ name = "Shaky", from = 0.0001, speed = 0.55, shake = 0.8 },
	},

	-- Lunge (dyno) between holds: bound to LeftShift / gamepad X / touch button
	LUNGE_COST = 22,
	LUNGE_HEIGHT = 9,
	LUNGE_TIME = 0.28,
	LUNGE_COOLDOWN = 1.2,
	LUNGE_MIN_HEIGHT = 2,

	-- Mantle over a ledge at the top of a climb
	MANTLE_REACH = 4.5, -- studs above the root part we scan for open space
	MANTLE_PROBE = 3, -- studs forward from the root part
	MANTLE_TIME = 0.4,

	-- Noise: monsters can hear you. Server writes the character attribute
	-- "ClimbNoise" (radius in studs) and "ClimbNoiseTime" (os.clock) for your
	-- enemy AI to read. 0 = silent.
	NOISE = { Grab = 0, Lunge = 45, Mantle = 30, Slip = 60 },

	-- Camera polish
	CLIMB_FOV_DELTA = -4,
	LUNGE_FOV_PUNCH = 7,
	CLIMB_ROLL_DEGREES = 1.2,
	SHAKE_ROLL_DEGREES = 1.4,

	-- Sounds (asset ids like "rbxassetid://123"); empty string = silent
	SOUNDS = {
		Grab = "",
		Lunge = "",
		Mantle = "",
		Slip = "",
	},

	REMOTE_NAME = "ClimbRemote",
})
