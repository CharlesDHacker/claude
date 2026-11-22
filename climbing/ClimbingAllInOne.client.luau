-- ALL-IN-ONE CLIMBING SCRIPT
-- Put this in ONE LocalScript inside StarterPlayer > StarterPlayerScripts. Nothing else needed.
-- Works on Roblox's built-in climbing (TrussParts / ladders).
-- Hold LeftShift while climbing to lunge upward. Watch the grip bar at the bottom.

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")

-- SETTINGS (change numbers here)
-- Tunable climbing values for 99 Nights style survival climbing
-- (trees, cliffs, ladders). Starting numbers: tune in playtests.

local Config = {
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
}

-- Pure grip/stamina logic. No Roblox services, so it is unit-testable.


type TierName = "Strong" | "Tiring" | "Shaky" | "Spent"

local Stamina = {}
Stamina.__index = Stamina

type Stamina = typeof(setmetatable({} :: { value: number, max: number }, Stamina))

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


-- Climb presentation: camera lean/shake/FOV, dust puffs, sounds.



local ClimbFx = {}

local active = false
local shakeIntensity = 0
local fovPunch = 0
local baseFov = 70
local currentDelta = 0
local roll = 0

local function camera(): Camera?
	return workspace.CurrentCamera
end

local function step(dt: number)
	local cam = camera()
	if not cam then
		return
	end

	local targetDelta = active and Config.CLIMB_FOV_DELTA or 0
	local alpha = 1 - math.exp(-8 * dt)
	currentDelta += (targetDelta - currentDelta) * alpha
	fovPunch += (0 - fovPunch) * (1 - math.exp(-6 * dt))
	if active or math.abs(currentDelta) > 0.01 or fovPunch > 0.01 then
		cam.FieldOfView = baseFov + currentDelta + fovPunch
	end

	local targetRoll = active and math.rad(Config.CLIMB_ROLL_DEGREES) or 0
	roll += (targetRoll - roll) * alpha

	local t = os.clock()
	local shake = 0
	if shakeIntensity > 0 then
		shake = math.noise(t * 14, 0.5) * math.rad(Config.SHAKE_ROLL_DEGREES) * shakeIntensity
	end
	if math.abs(roll) > 0.0005 or shake ~= 0 then
		cam.CFrame = cam.CFrame * CFrame.Angles(0, 0, roll + shake)
	end
end

function ClimbFx.start()
	RunService:BindToRenderStep("EggPeakClimbFx", Enum.RenderPriority.Camera.Value + 1, step)
end

function ClimbFx.setClimbing(on: boolean)
	if on and not active then
		local cam = camera()
		if cam then
			baseFov = cam.FieldOfView
			currentDelta = 0
		end
	end
	active = on
	if not on then
		shakeIntensity = 0
	end
end

function ClimbFx.setShake(intensity: number)
	shakeIntensity = intensity
end

function ClimbFx.punchFov()
	fovPunch = Config.LUNGE_FOV_PUNCH
end

local function playSound(root: BasePart, id: string)
	if id == "" then
		return
	end
	local s = Instance.new("Sound")
	s.SoundId = id
	s.RollOffMaxDistance = 80
	s.Parent = root
	s.Ended:Once(function()
		s:Destroy()
	end)
	s:Play()
end

local function emitter(root: BasePart): ParticleEmitter
	local existing = root:FindFirstChild("ClimbPuff")
	if existing and existing:IsA("ParticleEmitter") then
		return existing
	end
	local e = Instance.new("ParticleEmitter")
	e.Name = "ClimbPuff"
	e.Texture = "rbxasset://textures/particles/smoke_main.dds"
	e.Color = ColorSequence.new(Color3.fromRGB(190, 180, 160))
	e.Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.3),
		NumberSequenceKeypoint.new(1, 1),
	})
	e.Size = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.6),
		NumberSequenceKeypoint.new(1, 2.2),
	})
	e.Lifetime = NumberRange.new(0.4, 0.8)
	e.Speed = NumberRange.new(3, 7)
	e.SpreadAngle = Vector2.new(70, 70)
	e.Rate = 0
	e.Drag = 3
	e.LightEmission = 0.2
	e.Parent = root
	return e
end

-- action: "Grab" | "Lunge" | "Mantle" | "Slip"
function ClimbFx.burst(character: Model, action: string)
	local root = character:FindFirstChild("HumanoidRootPart")
	if not root or not root:IsA("BasePart") then
		return
	end
	local counts: { [string]: number } = { Grab = 6, Lunge = 22, Mantle = 30, Slip = 18 }
	emitter(root):Emit(counts[action] or 8)
	local id = (Config.SOUNDS :: { [string]: string })[action]
	if id then
		playSound(root, id)
	end
end


-- Grip bar: appears while climbing or recovering, pulses red when shaky.


local ClimbHud = {}

local gui: ScreenGui
local holder: Frame
local fill: Frame
local label: TextLabel
local shown = false

local COLORS: { [string]: Color3 } = {
	Strong = Color3.fromRGB(120, 220, 255),
	Tiring = Color3.fromRGB(255, 210, 90),
	Shaky = Color3.fromRGB(255, 110, 80),
	Spent = Color3.fromRGB(255, 60, 60),
}

function ClimbHud.init()
	gui = Instance.new("ScreenGui")
	gui.Name = "ClimbHud"
	gui.ResetOnSpawn = false
	gui.IgnoreGuiInset = true
	gui.Parent = Players.LocalPlayer:WaitForChild("PlayerGui")

	holder = Instance.new("Frame")
	holder.AnchorPoint = Vector2.new(0.5, 1)
	holder.Position = UDim2.new(0.5, 0, 1, -90)
	holder.Size = UDim2.new(0.28, 0, 0, 16)
	holder.BackgroundColor3 = Color3.fromRGB(20, 28, 40)
	holder.BackgroundTransparency = 1
	holder.Parent = gui
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(1, 0)
	corner.Parent = holder
	local sizeLimit = Instance.new("UISizeConstraint")
	sizeLimit.MaxSize = Vector2.new(360, 16)
	sizeLimit.MinSize = Vector2.new(140, 12)
	sizeLimit.Parent = holder

	fill = Instance.new("Frame")
	fill.Size = UDim2.fromScale(1, 1)
	fill.BackgroundColor3 = COLORS.Strong
	fill.BorderSizePixel = 0
	fill.Parent = holder
	local fillCorner = Instance.new("UICorner")
	fillCorner.CornerRadius = UDim.new(1, 0)
	fillCorner.Parent = fill

	label = Instance.new("TextLabel")
	label.AnchorPoint = Vector2.new(0.5, 1)
	label.Position = UDim2.new(0.5, 0, 0, -4)
	label.Size = UDim2.fromOffset(160, 18)
	label.BackgroundTransparency = 1
	label.Font = Enum.Font.GothamBold
	label.TextSize = 13
	label.TextColor3 = Color3.new(1, 1, 1)
	label.TextTransparency = 1
	label.Text = "GRIP"
	label.Parent = holder
end

local function setShown(on: boolean)
	if on == shown then
		return
	end
	shown = on
	local info = TweenInfo.new(0.2)
	TweenService:Create(holder, info, { BackgroundTransparency = on and 0.35 or 1 }):Play()
	TweenService:Create(label, info, { TextTransparency = on and 0 or 1 }):Play()
	TweenService:Create(fill, info, { BackgroundTransparency = on and 0 or 1 }):Play()
end

function ClimbHud.update(fraction: number, tier: string, visible: boolean, lockedOut: boolean)
	setShown(visible)
	if not shown then
		return
	end
	fill.Size = UDim2.fromScale(math.clamp(fraction, 0, 1), 1)
	local color = COLORS[tier] or COLORS.Strong
	if tier == "Shaky" or tier == "Spent" then
		local pulse = 0.5 + 0.5 * math.sin(os.clock() * 10)
		color = color:Lerp(Color3.new(1, 1, 1), pulse * 0.35)
	end
	fill.BackgroundColor3 = color
	label.Text = lockedOut and "CATCH YOUR BREATH" or "GRIP"
end


-- Climb mechanics layered on Roblox's Humanoid Climbing state, so it works with
-- whatever climb animation you already have:
--   * grip drains while climbing (faster when wet, cold or loaded)
--   * fatigue tiers slow you down and shake the camera
--   * grip hits zero -> you slip off and can't re-grab until you recover
--   * lunge (LeftShift / X / touch button) leaps up to the next hold
--   * mantle over a ledge at the top
--   * loud actions are reported to the server so monsters can hear them

local ContextActionService = game:GetService("ContextActionService")



local slippery: { [Enum.Material]: boolean } = {}
for _, name in Config.SLIPPERY_MATERIALS do
	local mat = (Enum.Material :: any)[name]
	if mat then
		slippery[mat] = true
	end
end

local grip = Stamina.new()
local character: Model? = nil
local humanoid: Humanoid? = nil
local root: BasePart? = nil

local climbing = false
local busy = false -- lunging or mantling
local lockedOut = false
local baseWalkSpeed = 16
local lungeReadyAt = 0
local rayParams = RaycastParams.new()
rayParams.FilterType = Enum.RaycastFilterType.Exclude

local function report(action: string)
	if character then
		ClimbFx.burst(character, action)
	end
end

local function cast(origin: Vector3, direction: Vector3): RaycastResult?
	return workspace:Raycast(origin, direction, rayParams)
end

local function tweenRoot(part: BasePart, target: CFrame, duration: number, style: Enum.EasingStyle)
	local tween = TweenService:Create(part, TweenInfo.new(duration, style, Enum.EasingDirection.Out), {
		CFrame = target,
	})
	tween:Play()
	tween.Completed:Wait()
end

-- Grip --------------------------------------------------------------------

local function drainMultiplier(): number
	local mult = 1
	if character then
		if character:GetAttribute("ClimbLoad") == true then
			mult *= Config.LOAD_DRAIN_MULT
		end
		if character:GetAttribute("Cold") == true then
			mult *= Config.COLD_DRAIN_MULT
		end
	end
	if root then
		local hit = cast(root.Position, root.CFrame.LookVector * Config.MANTLE_PROBE)
		if hit and slippery[hit.Material] then
			mult *= Config.SLIPPERY_DRAIN_MULT
		end
	end
	return mult
end

local function slip()
	local hum = humanoid
	if not hum or lockedOut then
		return
	end
	lockedOut = true
	report("Slip")
	hum:SetStateEnabled(Enum.HumanoidStateType.Climbing, false)
	hum:ChangeState(Enum.HumanoidStateType.Freefall)
end

local function setClimbAnimSpeed(speed: number)
	local hum = humanoid
	local animator = hum and hum:FindFirstChildOfClass("Animator")
	if not animator then
		return
	end
	for _, track in animator:GetPlayingAnimationTracks() do
		if string.find(string.lower(track.Name), "climb", 1, true) then
			track:AdjustSpeed(speed)
		end
	end
end

-- Mantle ------------------------------------------------------------------

local function findLedge(): Vector3?
	local part = root
	if not part then
		return nil
	end
	local look = part.CFrame.LookVector
	local wall = cast(part.Position, look * Config.MANTLE_PROBE)
	if not wall then
		return nil
	end
	local above = part.Position + Vector3.new(0, Config.MANTLE_REACH, 0)
	if cast(above, look * Config.MANTLE_PROBE) then
		return nil -- wall keeps going up
	end
	local top = above + look * (wall.Distance + 1.5) + Vector3.new(0, 1, 0)
	local floor = cast(top, Vector3.new(0, -(Config.MANTLE_REACH + 3), 0))
	if floor and floor.Normal.Y > 0.7 then
		return floor.Position
	end
	return nil
end

local function mantle(spot: Vector3)
	local hum, part = humanoid, root
	if not hum or not part then
		return
	end
	busy = true
	report("Mantle")
	local stand = spot + Vector3.new(0, hum.HipHeight + part.Size.Y / 2, 0)
	local look = part.CFrame.LookVector
	local up = CFrame.new(part.Position.X, stand.Y + 0.5, part.Position.Z) * part.CFrame.Rotation
	local over = CFrame.new(stand) * CFrame.lookAt(Vector3.zero, look)

	part.Anchored = true
	tweenRoot(part, up, Config.MANTLE_TIME * 0.5, Enum.EasingStyle.Quad)
	tweenRoot(part, over, Config.MANTLE_TIME * 0.5, Enum.EasingStyle.Quad)
	part.Anchored = false
	part.AssemblyLinearVelocity = Vector3.zero
	hum:ChangeState(Enum.HumanoidStateType.Running)
	busy = false
end

-- Lunge -------------------------------------------------------------------

local function lunge()
	local hum, part = humanoid, root
	if not climbing or busy or lockedOut or not hum or not part then
		return
	end
	if os.clock() < lungeReadyAt then
		return
	end

	local ceiling = cast(part.Position, Vector3.new(0, Config.LUNGE_HEIGHT + 2.5, 0))
	local height = Config.LUNGE_HEIGHT
	if ceiling then
		height = math.min(height, ceiling.Distance - 2.5)
	end
	if height < Config.LUNGE_MIN_HEIGHT then
		return
	end
	if not grip:spend(Config.LUNGE_COST) then
		return
	end

	busy = true
	lungeReadyAt = os.clock() + Config.LUNGE_COOLDOWN
	report("Lunge")
	ClimbFx.punchFov()

	part.Anchored = true
	tweenRoot(part, part.CFrame + Vector3.new(0, height, 0), Config.LUNGE_TIME, Enum.EasingStyle.Quint)
	part.Anchored = false
	part.AssemblyLinearVelocity = Vector3.zero
	busy = false
end

-- Frame update ------------------------------------------------------------

local function update(dt: number)
	local hum, part = humanoid, root
	if not hum or not part or hum.Health <= 0 then
		return
	end

	local grounded = hum.FloorMaterial ~= Enum.Material.Air

	if lockedOut and grounded and grip:fraction() >= Config.REGRAB_FRACTION then
		lockedOut = false
		hum:SetStateEnabled(Enum.HumanoidStateType.Climbing, true)
	end

	if climbing and not busy then
		local vy = part.AssemblyLinearVelocity.Y
		local moving = math.abs(vy) > 0.75
		local rate = moving and Config.CLIMB_DRAIN or Config.HANG_DRAIN
		grip:drain(rate * drainMultiplier() * dt)

		local tier, speedMult, shake = grip:tier()
		if tier == "Spent" then
			slip()
		else
			local loadMult = (character and character:GetAttribute("ClimbLoad") == true) and Config.LOAD_SPEED_MULT
				or 1
			hum.WalkSpeed = baseWalkSpeed * speedMult * loadMult
			ClimbFx.setShake(shake)
			setClimbAnimSpeed(moving and speedMult or 0)

			if vy > 0.5 then
				local ledge = findLedge()
				if ledge then
					task.spawn(mantle, ledge)
				end
			end
		end
	elseif grounded and not busy then
		grip:regen(Config.GROUND_REGEN * dt)
	end

	local tier = grip:tier()
	local visible = climbing or lockedOut or grip:fraction() < 0.999
	ClimbHud.update(grip:fraction(), tier, visible, lockedOut)
end

-- Setup -------------------------------------------------------------------

local function onCharacter(char: Model)
	character = char
	local hum = char:WaitForChild("Humanoid") :: Humanoid
	local rootPart = char:WaitForChild("HumanoidRootPart") :: BasePart
	humanoid, root = hum, rootPart
	rayParams.FilterDescendantsInstances = { char }
	grip = Stamina.new()
	climbing, busy, lockedOut = false, false, false
	baseWalkSpeed = hum.WalkSpeed

	hum.StateChanged:Connect(function(old, new)
		if new == Enum.HumanoidStateType.Climbing and not climbing then
			climbing = true
			baseWalkSpeed = hum.WalkSpeed
			ClimbFx.setClimbing(true)
			print("[Climb] grabbed - climbing mechanics active")
			report("Grab")
		elseif old == Enum.HumanoidStateType.Climbing and climbing then
			climbing = false
			hum.WalkSpeed = baseWalkSpeed
			ClimbFx.setClimbing(false)
		end
	end)
end

local function start()
	ClimbHud.init()
	ClimbFx.start()

	ContextActionService:BindAction("ClimbLunge", function(_, state)
		if state == Enum.UserInputState.Begin then
			lunge()
		end
		return Enum.ContextActionResult.Pass
	end, true, Enum.KeyCode.LeftShift, Enum.KeyCode.ButtonX)
	ContextActionService:SetTitle("ClimbLunge", "Lunge")
	ContextActionService:SetPosition("ClimbLunge", UDim2.new(1, -170, 1, -170))

	RunService.Heartbeat:Connect(update)
	print("[Climb] client running - climb a TrussPart to test")

	player.CharacterAdded:Connect(onCharacter)
	if player.Character then
		task.spawn(onCharacter, player.Character)
	end
end


start()
