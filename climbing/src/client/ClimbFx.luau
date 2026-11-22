--!strict
-- Climb presentation: camera lean/shake/FOV, dust puffs, sounds.

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local Config = require(ReplicatedStorage:WaitForChild("ClimbShared"):WaitForChild("ClimbConfig"))

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

return ClimbFx
