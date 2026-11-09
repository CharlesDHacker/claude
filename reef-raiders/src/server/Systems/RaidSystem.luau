--!strict
-- Server-authoritative raid handling. The client only *requests* a raid;
-- every rule is checked here via the shared pure RaidRules module.
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local RaidRules = require(Shared.Util.RaidRules)
local Types = require(Shared.Types)

local RaidSystem = {}

local states: { [number]: Types.PlayerState } = {}
local tanks: { [string]: Types.Tank } = {}
local remote: RemoteEvent

local function getState(userId: number): Types.PlayerState
	local state = states[userId]
	if not state then
		state = {
			userId = userId,
			joinedAt = os.time(),
			lastRaidAt = 0,
			carrying = nil,
			raidsReceived = {},
		}
		states[userId] = state
	end
	return state
end

function RaidSystem.init()
	remote = Instance.new("RemoteEvent")
	remote.Name = "RequestRaid"
	remote.Parent = ReplicatedStorage
end

function RaidSystem.start()
	Players.PlayerRemoving:Connect(function(player)
		states[player.UserId] = nil
	end)

	remote.OnServerEvent:Connect(function(player: Player, tankId: unknown)
		-- Validate remote input type first; never trust the client.
		if typeof(tankId) ~= "string" then
			return
		end
		local tank = tanks[tankId]
		if not tank then
			return
		end

		local raider = getState(player.UserId)
		local victim = getState(tank.ownerId)
		local result = RaidRules.canRaid(raider, victim, tank, os.time())
		if not result.ok then
			return
		end

		-- TODO: verify proximity (Config.MAX_RAID_DISTANCE) and the hold timer,
		-- notify the owner (alarm ping), and persist changes.
		raider.carrying = tank.creatureId
		raider.lastRaidAt = os.time()
		table.insert(victim.raidsReceived, os.time())
		tank.creatureId = nil
	end)
end

return RaidSystem
