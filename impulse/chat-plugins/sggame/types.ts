export interface SGPokemon {
	species: string;
	level: number;
	exp: number;
	hp: number;
	maxHp: number; // For easy reference, though it can be recalculated
	status: string;
	moves: string[];
	item?: string;
	gender?: 'M' | 'F' | 'N';
	shiny?: boolean;
	originalTrainer?: string;
	caughtLocation?: string;
}

export interface SGTrainerPokemon {
	species: string;
	level: number;
	moves?: string[];
	item?: string;
	ability?: string;
	shiny?: boolean;
}

export interface SGTrainer {
	id: string;
	name: string;
	title: string; // e.g. "Youngster", "Gym Leader", "Bug Catcher"
	sprite?: string;
	quote: string; // spoken before battle
	defeatQuote: string; // spoken on loss
	rewardMoney: number;
	rewardItem?: string;
	rewardBadge?: string;
	team: SGTrainerPokemon[];
	isGymLeader?: boolean;
	isEliteFour?: boolean;
}

export interface SGLocationConnection {
	id: string;
	name: string;
	reqKeyItem?: string;
	reqBadge?: string;
}

export interface SGWildEncounter {
	species: string;
	minLevel: number;
	maxLevel: number;
	weight?: number;
}

export interface SGLocation {
	id: string;
	name: string;
	region: string;
	type: 'town' | 'route' | 'dungeon';
	description: string;
	preview: string[];
	connections: SGLocationConnection[];
	wildSpecies: SGWildEncounter[];
	trainers: string[];
	hasCenter?: boolean;
	hasMart?: boolean;
	hasGym?: boolean;
	gymLeaderId?: string;
}

export interface SGPlayer {
	userid: string;
	party: SGPokemon[];
	pc: SGPokemon[];
	bag: Record<string, number>;
	location: string;
	introState: number;
	money: number;
	badges: string[];
	defeatedTrainers: string[];
	keyItems: string[];
	visitedLocations?: string[];
	pokedex: {
		seen: string[];
		caught: string[];
	};
	stats: {
		wildBattlesWon: number;
		trainersBeaten: number;
		pvpWins: number;
		pvpLosses: number;
	};
	pendingEvolutions?: { partyIndex: number, evoSpecies: string }[];
	pendingMoves?: { partyIndex: number, move: string }[];
	lastMessage?: string;
	lastScreen?: string;
	lastContext?: any;
}

export interface SGTradeRequest {
	fromUser: string;
	toUser: string;
	fromSlot?: number;
	toSlot?: number;
	confirmedFrom?: boolean;
	confirmedTo?: boolean;
	timestamp: number;
}
