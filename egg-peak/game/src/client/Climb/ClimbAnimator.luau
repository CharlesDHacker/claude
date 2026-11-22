--!strict
-- Egg Peak climb animator.
-- Plays the base climb clip, then layers Egg Peak's personality on top:
--   * cadence follows real speed; the clip freezes into a breathing "hang" when stopped
--   * lean, hip sway and head-look driven by the clip's own phase (so it stays in sync)
--   * heavier, slower, harder-breathing climb while carrying an egg
--   * cold shiver from the Cold attribute
--   * grip beats: ice chips, camera dip and optional sound each time a hand/boot lands

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local Config = require(game:GetService("ReplicatedStorage").Shared.ClimbConfig)

local TAU = math.pi * 2

type Joints = {
	waist: Motor6D?,
	neck: Motor6D?,
	leftShoulder: Motor6D?,
	rightShoulder: Motor6D?,
}

export type Animator = {
	destroy: (self: Animator) -> (),
}

local ClimbAnimator = {}
ClimbAnimator.__index = ClimbAnimator

local function findMotor(character: Model, name: string): Motor6D?
	local motor = character:FindFirstChild(name, true)
	if motor and motor:IsA("Motor6D") then
		return motor
	end
	return nil
end

local function makeChipEmitter(hand: BasePart): ParticleEmitter
	local emitter = Instance.new("ParticleEmitter")
	emitter.Name = "ClimbChips"
	emitter.Enabled = false
	emitter.Lifetime = NumberRange.new(0.25, 0.5)
	emitter.Speed = NumberRange.new(4, 9)
	emitter.SpreadAngle = Vector2.new(50, 50)
	emitter.Acceleration = Vector3.new(0, -30, 0)
	emitter.Rotation = NumberRange.new(0, 360)
	emitter.RotSpeed = NumberRange.new(-240, 240)
	emitter.Size = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.18),
		NumberSequenceKeypoint.new(1, 0),
	})
	emitter.Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0),
		NumberSequenceKeypoint.new(1, 1),
	})
	emitter.LightEmission = 0.2
	emitter.Parent = hand
	return emitter
end

local function dampFactor(rate: number, dt: number): number
	return 1 - math.exp(-rate * dt)
end

function ClimbAnimator.new(character: Model, humanoid: Humanoid): Animator
	local self = setmetatable({}, ClimbAnimator)
	local connections: { RBXScriptConnection } = {}

	local animator = humanoid:FindFirstChildOfClass("Animator") :: Animator?
	local root = humanoid.RootPart
	if not animator or not root then
		function self.destroy(_: any) end
		return self :: any
	end

	local joints: Joints = {
		waist = findMotor(character, "Waist"),
		neck = findMotor(character, "Neck"),
		leftShoulder = findMotor(character, "LeftShoulder"),
		rightShoulder = findMotor(character, "RightShoulder"),
	}

	local animation = Instance.new("Animation")
	animation.AnimationId = Config.BASE_ANIMATION_ID
	local track = animator:LoadAnimation(animation)
	track.Priority = Enum.AnimationPriority.Action
	track.Looped = true

	local leftHand = character:FindFirstChild("LeftHand") :: BasePart?
	local rightHand = character:FindFirstChild("RightHand") :: BasePart?
	local leftEmitter = leftHand and makeChipEmitter(leftHand)
	local rightEmitter = rightHand and makeChipEmitter(rightHand)

	local gripSound = Instance.new("Sound")
	gripSound.Name = "ClimbGrip"
	gripSound.Volume = Config.SOUND_VOLUME
	gripSound.RollOffMaxDistance = 60
	gripSound.Parent = root

	local climbing = false
	local blend = 0 -- 0 = not climbing, 1 = full pose; smooths entry/exit
	local pose = { lean = 0, sway = 0, look = 0, breath = 0 }
	local lastHalf = 0
	local cameraBump = 0
	local clock = 0

	local function surfaceAhead(): { chip: Color3, soundId: string }
		local params = RaycastParams.new()
		params.FilterType = Enum.RaycastFilterType.Exclude
		params.FilterDescendantsInstances = { character }
		local hit = Workspace:Raycast(root.Position, root.CFrame.LookVector * Config.WALL_RAY_LENGTH, params)
		local name = if hit then hit.Material.Name else "Default"
		return Config.SURFACES[name] or Config.SURFACES.Default
	end

	local function grip(hand: ParticleEmitter?, carrying: boolean)
		local surface = surfaceAhead()
		if hand then
			hand.Color = ColorSequence.new(surface.chip)
			hand:Emit(if carrying then Config.CHIP_COUNT_CARRYING else Config.CHIP_COUNT)
		end
		if surface.soundId ~= "" then
			gripSound.SoundId = surface.soundId
			gripSound.PlaybackSpeed = 0.92 + math.random() * 0.16
			gripSound:Play()
		end
		cameraBump = if carrying then Config.GRIP_CAMERA_BUMP_CARRYING else Config.GRIP_CAMERA_BUMP
	end

	local function setClimbing(on: boolean)
		if on == climbing then
			return
		end
		climbing = on
		if on then
			lastHalf = 0
			track:Play(Config.FADE_IN)
		else
			track:Stop(Config.FADE_OUT)
		end
	end

	table.insert(
		connections,
		humanoid.StateChanged:Connect(function(_, new)
			setClimbing(new == Enum.HumanoidStateType.Climbing)
		end)
	)
	setClimbing(humanoid:GetState() == Enum.HumanoidStateType.Climbing)

	table.insert(
		connections,
		RunService.PreRender:Connect(function(dt)
			clock += dt
			blend += ((if climbing then 1 else 0) - blend) * dampFactor(Config.SMOOTHING, dt)
			if not climbing and blend < 0.002 then
				blend = 0
				humanoid.CameraOffset = Vector3.zero
				return
			end

			local carrying = character:GetAttribute("CarryingEgg") == true
			local cold = math.clamp((character:GetAttribute("Cold") :: number?) or 0, 0, 1)
			local speed = root.AssemblyLinearVelocity.Magnitude
			local hanging = speed < Config.HANG_THRESHOLD

			-- Cadence: speed-synced, heavier with an egg, frozen when hanging.
			if track.IsPlaying then
				local playback = math.clamp(speed / Config.REFERENCE_SPEED, Config.MIN_PLAYBACK, Config.MAX_PLAYBACK)
				if carrying then
					playback *= Config.CARRY_CADENCE
				end
				track:AdjustSpeed(if hanging then 0 else playback)
			end

			-- Clip phase (0..1) drives the procedural layer so it never drifts out of sync.
			local phase = if track.Length > 0 then (track.TimePosition / track.Length) % 1 else 0
			local sway = math.sin(phase * TAU)

			-- Grip beats at each half cycle.
			local half = if phase < 0.5 then 0 else 1
			if not hanging and half ~= lastHalf then
				lastHalf = half
				grip(if half == 0 then leftEmitter else rightEmitter, carrying)
			end

			-- Targets
			local lean = if carrying then Config.LEAN_BACK_CARRYING else Config.LEAN_BACK
			local breathRate = Config.BREATH_RATE * (if carrying then 1.25 else 1)
			local breathDepth = Config.BREATH_DEPTH * (if carrying then Config.BREATH_EXTRA_CARRYING else 1)
			local breath = if hanging then math.sin(clock * breathRate * TAU) * breathDepth else 0
			local look = Config.LOOK_UP * (if hanging then 0.5 else 1)

			local k = dampFactor(Config.SMOOTHING, dt)
			pose.lean += (lean - pose.lean) * k
			pose.sway += ((if hanging then 0 else sway) - pose.sway) * k
			pose.look += (look - pose.look) * k
			pose.breath += (breath - pose.breath) * k

			-- Shiver: fast low-amplitude noise, only as cold as the meter says.
			local shiver = Config.SHIVER_MAX * cold
			local shakeX = math.noise(clock * Config.SHIVER_RATE, 0.3) * shiver
			local shakeZ = math.noise(clock * Config.SHIVER_RATE, 7.1) * shiver

			local w = blend
			if joints.waist then
				joints.waist.Transform *= CFrame.Angles(
					(pose.lean + pose.breath + shakeX) * w,
					0,
					(pose.sway * Config.HIP_SWAY + shakeZ) * w
				)
			end
			if joints.neck then
				joints.neck.Transform *= CFrame.Angles(-(pose.look + pose.lean) * w + shakeX * 0.5 * w, 0, 0)
			end
			if joints.leftShoulder then
				joints.leftShoulder.Transform *= CFrame.Angles(0, 0, -pose.sway * Config.SHOULDER_ROLL * w)
			end
			if joints.rightShoulder then
				joints.rightShoulder.Transform *= CFrame.Angles(0, 0, -pose.sway * Config.SHOULDER_ROLL * w)
			end

			-- Camera dip on each grip, eased back out.
			cameraBump += (0 - cameraBump) * dampFactor(18, dt)
			humanoid.CameraOffset = Vector3.new(0, -cameraBump * w, 0)
		end)
	)

	function self.destroy(_: any)
		for _, connection in connections do
			connection:Disconnect()
		end
		table.clear(connections)
		track:Stop(0)
		animation:Destroy()
		gripSound:Destroy()
		if leftEmitter then
			leftEmitter:Destroy()
		end
		if rightEmitter then
			rightEmitter:Destroy()
		end
		humanoid.CameraOffset = Vector3.zero
	end

	return self :: any
end

--- Attach to the local player's character now and on every respawn.
function ClimbAnimator.start()
	local player = Players.LocalPlayer
	local current: Animator? = nil

	local function onCharacter(character: Model)
		if current then
			current:destroy()
			current = nil
		end
		local humanoid = character:WaitForChild("Humanoid", 10) :: Humanoid?
		if humanoid and humanoid.RigType == Enum.HumanoidRigType.R15 then
			current = ClimbAnimator.new(character, humanoid)
		end
	end

	player.CharacterAdded:Connect(onCharacter)
	if player.Character then
		task.spawn(onCharacter, player.Character)
	end
end

return ClimbAnimator
