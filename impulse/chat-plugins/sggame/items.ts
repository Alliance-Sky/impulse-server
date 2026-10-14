export interface SGItemData {
	name: string;
	category: string;
	description: string;
	price?: number;
	healPct?: number;
	cureStatus?: boolean | string | string[];
	revive?: boolean;
	moveId?: string;
}

export const SGItems: Record<string, SGItemData> = {
	// Pokeballs
	pokeball: {
		name: 'Poke Ball',
		category: 'Pokeballs',
		description: 'A device for catching wild Pokemon.',
		price: 200,
	},
	greatball: {
		name: 'Great Ball',
		category: 'Pokeballs',
		description: 'A good, high-performance Ball that provides a higher Pokemon catch rate than a standard Poke Ball.',
		price: 600,
	},
	ultraball: {
		name: 'Ultra Ball',
		category: 'Pokeballs',
		description: 'An ultra-high-performance Ball that provides a higher success rate for catching Pokemon than a Great Ball.',
		price: 1200,
	},
	masterball: {
		name: 'Master Ball',
		category: 'Pokeballs',
		description: 'The best Ball with the ultimate level of performance. With it, you will catch any wild Pokemon without fail.',
		price: 50000,
	},

	// Medicine
	potion: {
		name: 'Potion',
		category: 'Medicine',
		description: 'Restores 30% of max HP.',
		healPct: 30,
		price: 300,
	},
	superpotion: {
		name: 'Super Potion',
		category: 'Medicine',
		description: 'Restores 50% of max HP.',
		healPct: 50,
		price: 700,
	},
	hyperpotion: {
		name: 'Hyper Potion',
		category: 'Medicine',
		description: 'Restores 70% of max HP.',
		healPct: 70,
		price: 1500,
	},
	maxpotion: {
		name: 'Max Potion',
		category: 'Medicine',
		description: 'Fully restores HP.',
		healPct: 100,
		price: 2500,
	},
	fullrestore: {
		name: 'Full Restore',
		category: 'Medicine',
		description: 'Fully restores HP and cures any status condition.',
		healPct: 100,
		cureStatus: true,
		price: 3000,
	},
	revive: {
		name: 'Revive',
		category: 'Medicine',
		description: 'Revives one fainted Pokémon and restores 50% of its max HP.',
		healPct: 50,
		revive: true,
		price: 2000,
	},
	maxrevive: {
		name: 'Max Revive',
		category: 'Medicine',
		description: 'Revives one fainted Pokémon and fully restores its HP.',
		healPct: 100,
		revive: true,
		price: 4000,
	},
	antidote: {
		name: 'Antidote',
		category: 'Medicine',
		description: 'A spray-type medicine for treating poisoning.',
		cureStatus: ['psn', 'tox'],
		price: 200,
	},
	burnheal: {
		name: 'Burn Heal',
		category: 'Medicine',
		description: 'A topical medicine for treating burns.',
		cureStatus: 'brn',
		price: 250,
	},
	awakening: {
		name: 'Awakening',
		category: 'Medicine',
		description: 'A spray-type medicine to wake the sleeping.',
		cureStatus: 'slp',
		price: 200,
	},
	iceheal: {
		name: 'Ice Heal',
		category: 'Medicine',
		description: 'A spray-type medicine for treating freezing.',
		cureStatus: 'frz',
		price: 250,
	},
	paralyzeheal: {
		name: 'Paralyze Heal',
		category: 'Medicine',
		description: 'A spray-type medicine for treating paralysis.',
		cureStatus: 'par',
		price: 200,
	},
	fullheal: {
		name: 'Full Heal',
		category: 'Medicine',
		description: 'A spray-type medicine that heals all status conditions.',
		cureStatus: true,
		price: 400,
	},

	// Evolution Items across Gens 1-9
	firestone: {
		name: 'Fire Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It has a warm orange heart.',
		price: 2500,
	},
	waterstone: {
		name: 'Water Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It is the clear blue of a pool of water.',
		price: 2500,
	},
	thunderstone: {
		name: 'Thunder Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It has a distinct thunderbolt pattern.',
		price: 2500,
	},
	leafstone: {
		name: 'Leaf Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It has an unmistakable leaf pattern.',
		price: 2500,
	},
	moonstone: {
		name: 'Moon Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It is as dark as the night sky.',
		price: 3000,
	},
	sunstone: {
		name: 'Sun Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It is as red as the evening sun.',
		price: 3000,
	},
	shinystone: {
		name: 'Shiny Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It shines with a dazzling light.',
		price: 3000,
	},
	duskstone: {
		name: 'Dusk Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It is as dark as dark can be.',
		price: 3000,
	},
	dawnstone: {
		name: 'Dawn Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It sparkles like a glittering eye.',
		price: 3000,
	},
	icestone: {
		name: 'Ice Stone',
		category: 'Evolution',
		description: 'A peculiar stone that can make certain species of Pokémon evolve. It has an unmistakable snowflake pattern.',
		price: 3000,
	},
	linkingcord: {
		name: 'Linking Cord',
		category: 'Evolution',
		description: 'A mysterious string exuding a strange sense of connection that makes trade-evolution Pokémon evolve immediately.',
		price: 4000,
	},
	tradestone: {
		name: 'Trade Stone',
		category: 'Evolution',
		description: 'An ancient stone emitting frequencies capable of triggering trade-induced evolutions.',
		price: 4000,
	},
	sweetapple: {
		name: 'Sweet Apple',
		category: 'Evolution',
		description: 'A peculiar apple that makes Applin evolve into Appletun. It is exceptionally sweet.',
		price: 3000,
	},
	tartapple: {
		name: 'Tart Apple',
		category: 'Evolution',
		description: 'A peculiar apple that makes Applin evolve into Flapple. It is exceptionally tart.',
		price: 3000,
	},
	auspiciousarmor: {
		name: 'Auspicious Armor',
		category: 'Evolution',
		description: 'A peculiar set of armor that enables a Charcadet to evolve into Armarouge.',
		price: 4000,
	},
	maliciousarmor: {
		name: 'Malicious Armor',
		category: 'Evolution',
		description: 'A peculiar set of armor that enables a Charcadet to evolve into Ceruledge.',
		price: 4000,
	},

	// Key Items
	expall: {
		name: 'Exp. All',
		category: 'Key Items',
		description: 'An item that distributes EXP points to all healthy Pokémon in your party, even if they did not participate in the battle.',
	},
	tree_shears: {
		name: 'Tree Shears',
		category: 'Key Items',
		description: 'Sharp pruning shears capable of easily trimming small trees without requiring HM Cut.',
	},
	surfboard: {
		name: 'Surfboard',
		category: 'Key Items',
		description: 'A sleek, buoyant board enabling you to traverse waterways and ocean routes without requiring HM Surf.',
	},
	bicycle: {
		name: 'Bicycle',
		category: 'Key Items',
		description: 'A stylish folding bike for swift travel across routes and cycling roads.',
	},
	silph_scope: {
		name: 'Silph Scope',
		category: 'Key Items',
		description: 'A high-tech scope designed by Silph Co. that makes invisible ghosts recognizable.',
	},
	fly_pass: {
		name: 'Fly Network Pass',
		category: 'Key Items',
		description: 'An official Kanto League transit pass enabling fast travel across previously discovered towns.',
	},

	// Held Items
	leftovers: {
		name: 'Leftovers',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. The holder\'s HP is slowly but steadily restored throughout every battle.',
		price: 4000,
	},
	lifeorb: {
		name: 'Life Orb',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. It boosts the power of moves, but at the cost of some HP on each hit.',
		price: 4000,
	},
	choiceband: {
		name: 'Choice Band',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. This headband boosts Attack, but allows the use of only one of its moves.',
		price: 5000,
	},
	choicespecs: {
		name: 'Choice Specs',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. These distinctive glasses boost Sp. Atk, but allow the use of only one of its moves.',
		price: 5000,
	},
	choicescarf: {
		name: 'Choice Scarf',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. This scarf boosts Speed, but allows the use of only one of its moves.',
		price: 5000,
	},
	focussash: {
		name: 'Focus Sash',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. If the holder has full HP, it will endure a potential KO attack with 1 HP.',
		price: 3000,
	},
	eviolite: {
		name: 'Eviolite',
		category: 'Held Items',
		description: 'A mysterious evolutionary lump. When held by a Pokémon that can still evolve, it raises both Defense and Sp. Def.',
		price: 4000,
	},
	rockyhelmet: {
		name: 'Rocky Helmet',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. If the holder is hit, the attacker also takes damage.',
		price: 4000,
	},
	assaultvest: {
		name: 'Assault Vest',
		category: 'Held Items',
		description: 'An item to be held by a Pokémon. Raises Sp. Def, but prevents the use of status moves.',
		price: 5000,
	},

	// Mega Stones across Gens
	venusaurite: {
		name: 'Venusaurite',
		category: 'Held Items',
		description: 'Have Venusaur hold it to Mega Evolve during battle.',
		price: 10000,
	},
	charizarditex: {
		name: 'Charizardite X',
		category: 'Held Items',
		description: 'Have Charizard hold it to Mega Evolve into Mega Charizard X during battle.',
		price: 10000,
	},
	charizarditey: {
		name: 'Charizardite Y',
		category: 'Held Items',
		description: 'Have Charizard hold it to Mega Evolve into Mega Charizard Y during battle.',
		price: 10000,
	},
	blastoisinite: {
		name: 'Blastoisinite',
		category: 'Held Items',
		description: 'Have Blastoise hold it to Mega Evolve during battle.',
		price: 10000,
	},
	sceptilite: {
		name: 'Sceptilite',
		category: 'Held Items',
		description: 'Have Sceptile hold it to Mega Evolve during battle.',
		price: 10000,
	},
	blazikenite: {
		name: 'Blazikenite',
		category: 'Held Items',
		description: 'Have Blaziken hold it to Mega Evolve during battle.',
		price: 10000,
	},
	swampertite: {
		name: 'Swampertite',
		category: 'Held Items',
		description: 'Have Swampert hold it to Mega Evolve during battle.',
		price: 10000,
	},
	lucarionite: {
		name: 'Lucarionite',
		category: 'Held Items',
		description: 'Have Lucario hold it to Mega Evolve during battle.',
		price: 10000,
	},
	gengarite: {
		name: 'Gengarite',
		category: 'Held Items',
		description: 'Have Gengar hold it to Mega Evolve during battle.',
		price: 10000,
	},

	// TMs
	tm26: {
		name: 'TM26 Earthquake',
		category: 'TMs',
		description: 'An earthquake that strikes every Pokémon around the user.',
		moveId: 'earthquake',
		price: 5000,
	},
	tm06: {
		name: 'TM06 Toxic',
		category: 'TMs',
		description: 'A move that leaves the target badly poisoned.',
		moveId: 'toxic',
		price: 5000,
	},
	tm13: {
		name: 'TM13 Ice Beam',
		category: 'TMs',
		description: 'The target is struck with an icy-cold beam of energy. This may also leave the target frozen.',
		moveId: 'icebeam',
		price: 5000,
	},
	tm24: {
		name: 'TM24 Thunderbolt',
		category: 'TMs',
		description: 'A strong electric blast crashes down on the target. This may also leave the target with paralysis.',
		moveId: 'thunderbolt',
		price: 5000,
	},
	tm35: {
		name: 'TM35 Flamethrower',
		category: 'TMs',
		description: 'The target is scorched with an intense blast of fire. This may also leave the target with a burn.',
		moveId: 'flamethrower',
		price: 5000,
	},
	tm30: {
		name: 'TM30 Shadow Ball',
		category: 'TMs',
		description: 'The user hurls a shadowy blob at the target. This may also lower the target\'s Sp. Def stat.',
		moveId: 'shadowball',
		price: 5000,
	},
	tm39: {
		name: 'TM39 Rock Tomb',
		category: 'TMs',
		description: 'Boulders are hurled at the target. This also lowers the target\'s Speed stat by preventing its movement.',
		moveId: 'rocktomb',
		price: 5000,
	},
	tm03: {
		name: 'TM03 Water Pulse',
		category: 'TMs',
		description: 'The user attacks the target with a pulsing blast of water. This may also confuse the target.',
		moveId: 'waterpulse',
		price: 5000,
	},
	tm19: {
		name: 'TM19 Giga Drain',
		category: 'TMs',
		description: 'A nutrient-draining attack. The user\'s HP is restored by half the damage taken by the target.',
		moveId: 'gigadrain',
		price: 5000,
	},
	tm29: {
		name: 'TM29 Psychic',
		category: 'TMs',
		description: 'The target is hit with a strong telekinetic force. This may also lower the target\'s Sp. Def stat.',
		moveId: 'psychic',
		price: 5000,
	},
	tm38: {
		name: 'TM38 Fire Blast',
		category: 'TMs',
		description: 'The target is attacked with an intense blast of all-consuming fire. This may also leave the target with a burn.',
		moveId: 'fireblast',
		price: 5000,
	},
};

