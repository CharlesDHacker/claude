--!strict
-- Climb mechanics layered on Roblox's Humanoid Climbing state, so it works with
-- whatever climb animation you already have:
--   * grip drains while climbing (faster when wet, cold or loaded)
--   * fatigue tiers slow you down and shake the camera
--   * grip hits zero -> you slip off and can't re-grab until you recover
--   * lunge (LeftShift / X / touch button) leaps up to the next hold
--   * mantle over a ledge at the top
--   * loud actions are reported to the server so monsters can hear them

local ContextActionService = game:GetService("ContextActionService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")

local Shared = ReplicatedStorage:WaitForChild("ClimbShared")
local Config = require(Shared:WaitForChild("ClimbConfig"))
local Stamina = require(Shared:WaitForChild("ClimbStamina"))
local ClimbFx = require(script.Parent:WaitForChild("ClimbFx"))
local ClimbHud = require(script.Parent:WaitForChild("ClimbHud"))

local player = Players.LocalPlayer
local remote = ReplicatedStorage:WaitForChild(Config.REMOTE_NAME) :: RemoteEvent

local ClimbController = {}

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
	remote:FireServer(action)
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
			report("Grab")
		elseif old == Enum.HumanoidStateType.Climbing and climbing then
			climbing = false
			hum.WalkSpeed = baseWalkSpeed
			ClimbFx.setClimbing(false)
		end
	end)
end

function ClimbController.start()
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

	remote.OnClientEvent:Connect(function(other: Player, action: string)
		if other ~= player and other.Character then
			ClimbFx.burst(other.Character, action)
		end
	end)

	RunService.Heartbeat:Connect(update)

	player.CharacterAdded:Connect(onCharacter)
	if player.Character then
		task.spawn(onCharacter, player.Character)
	end
end

return ClimbController
