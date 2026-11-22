--!strict
-- Climb server: creates the remote, validates and rate-limits client climb
-- actions, then relays them so other players see the effects.
-- NOTE: character movement is client-owned in Roblox, so grip/stamina here is
-- gameplay + presentation, not an anti-cheat boundary. Anything that affects
-- progression (items, currency) must be validated by its own server system.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("ClimbShared"):WaitForChild("ClimbConfig"))

local remote = Instance.new("RemoteEvent")
remote.Name = Config.REMOTE_NAME
remote.Parent = ReplicatedStorage

local ALLOWED: { [string]: number } = {
	Grab = 0.2,
	Lunge = Config.LUNGE_COOLDOWN * 0.8,
	Mantle = 0.8,
	Slip = 0.8,
}

local lastFired: { [Player]: { [string]: number } } = {}

remote.OnServerEvent:Connect(function(player: Player, action: unknown)
	if typeof(action) ~= "string" then
		return
	end
	local minGap = ALLOWED[action]
	if not minGap then
		return
	end

	local character = player.Character
	local humanoid = character and character:FindFirstChildOfClass("Humanoid")
	if not humanoid or humanoid.Health <= 0 then
		return
	end

	local now = os.clock()
	local record = lastFired[player]
	if not record then
		return
	end
	local last = record[action] or 0
	if now - last < minGap then
		return
	end
	record[action] = now

	-- Monsters hear loud climbing. Enemy AI reads these attributes.
	local radius = (Config.NOISE :: { [string]: number })[action] or 0
	if radius > 0 and character then
		character:SetAttribute("ClimbNoise", radius)
		character:SetAttribute("ClimbNoiseTime", now)
	end

	remote:FireAllClients(player, action)
end)

Players.PlayerAdded:Connect(function(player)
	lastFired[player] = {}
end)
for _, player in Players:GetPlayers() do
	lastFired[player] = lastFired[player] or {}
end
Players.PlayerRemoving:Connect(function(player)
	lastFired[player] = nil
end)
