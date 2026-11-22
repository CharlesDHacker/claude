--!strict
-- Grip bar: appears while climbing or recovering, pulses red when shaky.

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

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

return ClimbHud
