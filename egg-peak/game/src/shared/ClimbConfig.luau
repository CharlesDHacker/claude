--!strict
-- Egg Peak climb feel. Everything here is cosmetic and client-side;
-- the server owns real movement and the attributes read below.
--
-- Attributes read from the Character (set by the server):
--   CarryingEgg : boolean   -- hauling an egg up/down the mountain
--   Cold        : number    -- 0..1, from the Blizzard Peak cold meter
--   Heat        : number    -- 0..1, the Egg Heat meter (NPC attention)

return table.freeze({
	-- Your base animation. Default is Roblox's stock R15 climb. Swap in your own
	-- uploaded climb animation id and everything else layers on top of it.
	BASE_ANIMATION_ID = "rbxassetid://507765644",

	-- Playback: cadence follows real climbing speed so hands never skate.
	REFERENCE_SPEED = 12, -- studs/s at which the clip plays at 1x
	MIN_PLAYBACK = 0.35,
	MAX_PLAYBACK = 1.6,
	HANG_THRESHOLD = 0.6, -- below this speed we freeze the clip and "hang"
	CARRY_CADENCE = 0.85, -- slower, heavier steps with an egg on your back
	FADE_IN = 0.12,
	FADE_OUT = 0.2,

	-- Body language (radians)
	LEAN_BACK = math.rad(7), -- shoulders sit slightly off the wall
	LEAN_BACK_CARRYING = math.rad(-5), -- egg pulls you off; you hug the wall instead
	HIP_SWAY = math.rad(6), -- hips swing toward the planted hand
	SHOULDER_ROLL = math.rad(4),
	LOOK_UP = math.rad(14), -- head tips toward the next hold
	BREATH_RATE = 1.6, -- hz while hanging
	BREATH_DEPTH = math.rad(1.8),
	BREATH_EXTRA_CARRYING = 1.6, -- heavier breathing with an egg
	SHIVER_MAX = math.rad(2.2), -- at Cold = 1
	SHIVER_RATE = 24,
	SMOOTHING = 12, -- higher = snappier pose blending

	-- Grip beats: fired each time a hand/boot "lands" (twice per cycle)
	GRIP_CAMERA_BUMP = 0.06, -- studs of camera dip per grip
	GRIP_CAMERA_BUMP_CARRYING = 0.1,
	CHIP_COUNT = 5,
	CHIP_COUNT_CARRYING = 8,
	WALL_RAY_LENGTH = 3.5,

	-- Per-surface look/sound. Leave SoundId empty until you have audio.
	SURFACES = {
		Ice = { chip = Color3.fromRGB(190, 228, 255), soundId = "" },
		Glacier = { chip = Color3.fromRGB(170, 215, 250), soundId = "" },
		Snow = { chip = Color3.fromRGB(245, 248, 255), soundId = "" },
		Rock = { chip = Color3.fromRGB(150, 148, 145), soundId = "" },
		Default = { chip = Color3.fromRGB(215, 215, 215), soundId = "" },
	} :: { [string]: { chip: Color3, soundId: string } },
	SOUND_VOLUME = 0.5,
})
