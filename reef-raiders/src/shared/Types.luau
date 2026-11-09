--!strict
-- Shared type definitions used by both client and server.

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic"

export type CreatureDef = {
	id: string,
	name: string,
	rarity: Rarity,
	zone: string,
}

export type SubTier = {
	tier: number,
	name: string,
	maxDepth: number,
	oxygenSeconds: number,
	cargo: number,
	price: number,
	unlocks: { string },
}

export type Tank = {
	ownerId: number,
	creatureId: string?,
	lockedUntil: number,
}

export type PlayerState = {
	userId: number,
	joinedAt: number,
	lastRaidAt: number,
	carrying: string?,
	raidsReceived: { number },
}

return {}
