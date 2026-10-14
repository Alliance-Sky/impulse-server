import { type SGLocation } from './types';

export const SG_LOCATIONS: Record<string, SGLocation> = {
	pallet_town: {
		id: 'pallet_town',
		name: 'Pallet Town',
		region: 'Kanto',
		type: 'town',
		description: 'Shades of your journey await! A tranquil town with Prof. Oak\'s Laboratory and your home.',
		preview: ['pikachu', 'eevee'],
		connections: [
			{ id: 'route1', name: 'Route 1 (North)' },
			{ id: 'route21', name: 'Route 21 Ocean (South)', reqKeyItem: 'surfboard' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: false,
		hasGym: false,
	},

	route1: {
		id: 'route1',
		name: 'Route 1',
		region: 'Kanto',
		type: 'route',
		description: 'A winding dirt path connecting Pallet Town and Viridian City through gentle meadows.',
		preview: ['pidgey', 'rattata'],
		connections: [
			{ id: 'pallet_town', name: 'Pallet Town (South)' },
			{ id: 'viridian_city', name: 'Viridian City (North)' },
		],
		wildSpecies: [
			{ species: 'pidgey', minLevel: 2, maxLevel: 5, weight: 50 },
			{ species: 'rattata', minLevel: 2, maxLevel: 4, weight: 50 },
		],
		trainers: ['youngster_joey'],
	},

	viridian_city: {
		id: 'viridian_city',
		name: 'Viridian City',
		region: 'Kanto',
		type: 'town',
		description: 'The eternally green paradise! Home to the 8th Gym and routes branching in all directions.',
		preview: ['poliwag', 'nidoranm'],
		connections: [
			{ id: 'route1', name: 'Route 1 (South)' },
			{ id: 'route2', name: 'Route 2 (North)' },
			{ id: 'route22', name: 'Route 22 (West)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'giovanni',
	},

	route22: {
		id: 'route22',
		name: 'Route 22',
		region: 'Kanto',
		type: 'route',
		description: 'A rocky path leading west toward the grand gatehouse of the Pokémon League.',
		preview: ['mankey', 'spearow', 'nidoranm'],
		connections: [
			{ id: 'viridian_city', name: 'Viridian City (East)' },
			{ id: 'victory_road', name: 'Victory Road (West)', reqBadge: 'earth' },
		],
		wildSpecies: [
			{ species: 'mankey', minLevel: 3, maxLevel: 5, weight: 30 },
			{ species: 'spearow', minLevel: 3, maxLevel: 5, weight: 30 },
			{ species: 'nidoranm', minLevel: 3, maxLevel: 5, weight: 20 },
			{ species: 'nidoranf', minLevel: 3, maxLevel: 5, weight: 20 },
		],
		trainers: [],
	},

	route2: {
		id: 'route2',
		name: 'Route 2',
		region: 'Kanto',
		type: 'route',
		description: 'A meadow lane leading to the entrance of Viridian Forest and Diglett\'s Cave.',
		preview: ['caterpie', 'weedle', 'pidgey'],
		connections: [
			{ id: 'viridian_city', name: 'Viridian City (South)' },
			{ id: 'viridian_forest', name: 'Viridian Forest (North)' },
			{ id: 'pewter_city', name: 'Pewter City (North Bypass)', reqKeyItem: 'tree_shears' },
		],
		wildSpecies: [
			{ species: 'caterpie', minLevel: 3, maxLevel: 6, weight: 35 },
			{ species: 'weedle', minLevel: 3, maxLevel: 6, weight: 35 },
			{ species: 'pidgey', minLevel: 3, maxLevel: 6, weight: 30 },
		],
		trainers: [],
	},

	viridian_forest: {
		id: 'viridian_forest',
		name: 'Viridian Forest',
		region: 'Kanto',
		type: 'dungeon',
		description: 'A lush canopy of towering trees teeming with bug Pokémon and wild Pikachu.',
		preview: ['pikachu', 'butterfree', 'beedrill', 'pinsir'],
		connections: [
			{ id: 'route2', name: 'Route 2 (South)' },
			{ id: 'pewter_city', name: 'Pewter City (North)' },
		],
		wildSpecies: [
			{ species: 'caterpie', minLevel: 3, maxLevel: 6, weight: 25 },
			{ species: 'metapod', minLevel: 4, maxLevel: 6, weight: 15 },
			{ species: 'weedle', minLevel: 3, maxLevel: 6, weight: 25 },
			{ species: 'kakuna', minLevel: 4, maxLevel: 6, weight: 15 },
			{ species: 'pikachu', minLevel: 4, maxLevel: 7, weight: 15 },
			{ species: 'pinsir', minLevel: 6, maxLevel: 8, weight: 5 },
		],
		trainers: ['bugcatcher_ricky'],
	},

	pewter_city: {
		id: 'pewter_city',
		name: 'Pewter City',
		region: 'Kanto',
		type: 'town',
		description: 'A stone-gray city situated at the base of Mt. Moon. Home to Brock\'s Rock Gym and Museum!',
		preview: ['geodude', 'onix', 'aerodactyl'],
		connections: [
			{ id: 'viridian_forest', name: 'Viridian Forest (South)' },
			{ id: 'route3', name: 'Route 3 (East)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'brock',
	},

	route3: {
		id: 'route3',
		name: 'Route 3',
		region: 'Kanto',
		type: 'route',
		description: 'A rocky winding trail ascending eastward toward the entrance of Mt. Moon.',
		preview: ['spearow', 'sandshrew', 'jigglypuff'],
		connections: [
			{ id: 'pewter_city', name: 'Pewter City (West)' },
			{ id: 'mt_moon', name: 'Mt. Moon (East)' },
		],
		wildSpecies: [
			{ species: 'spearow', minLevel: 8, maxLevel: 12, weight: 35 },
			{ species: 'pidgey', minLevel: 8, maxLevel: 12, weight: 30 },
			{ species: 'sandshrew', minLevel: 8, maxLevel: 11, weight: 25 },
			{ species: 'jigglypuff', minLevel: 5, maxLevel: 9, weight: 10 },
		],
		trainers: ['lass_haley', 'camper_liam'],
	},

	mt_moon: {
		id: 'mt_moon',
		name: 'Mt. Moon',
		region: 'Kanto',
		type: 'dungeon',
		description: 'A mystical cavern known for falling meteors and rare Moon Stones.',
		preview: ['clefairy', 'zubat', 'geodude', 'paras'],
		connections: [
			{ id: 'route3', name: 'Route 3 (West)' },
			{ id: 'route4', name: 'Route 4 (East)' },
		],
		wildSpecies: [
			{ species: 'zubat', minLevel: 8, maxLevel: 12, weight: 40 },
			{ species: 'geodude', minLevel: 8, maxLevel: 12, weight: 30 },
			{ species: 'paras', minLevel: 8, maxLevel: 11, weight: 20 },
			{ species: 'clefairy', minLevel: 9, maxLevel: 13, weight: 10 },
		],
		trainers: ['hiker_anthony'],
	},

	route4: {
		id: 'route4',
		name: 'Route 4',
		region: 'Kanto',
		type: 'route',
		description: 'A downhill slope descending out of Mt. Moon directly toward Cerulean City.',
		preview: ['ekans', 'sandshrew', 'spearow'],
		connections: [
			{ id: 'mt_moon', name: 'Mt. Moon (West)' },
			{ id: 'cerulean_city', name: 'Cerulean City (East)' },
		],
		wildSpecies: [
			{ species: 'rattata', minLevel: 10, maxLevel: 14, weight: 30 },
			{ species: 'spearow', minLevel: 10, maxLevel: 14, weight: 30 },
			{ species: 'ekans', minLevel: 10, maxLevel: 13, weight: 20 },
			{ species: 'sandshrew', minLevel: 10, maxLevel: 13, weight: 20 },
		],
		trainers: [],
	},

	cerulean_city: {
		id: 'cerulean_city',
		name: 'Cerulean City',
		region: 'Kanto',
		type: 'town',
		description: 'A floral city enveloped in pure water. Home to Misty\'s Water Gym and the Cerulean Cape!',
		preview: ['staryu', 'psyduck', 'poliwag'],
		connections: [
			{ id: 'route4', name: 'Route 4 (West)' },
			{ id: 'route24_25', name: 'Route 24 & Nugget Bridge (North)' },
			{ id: 'route5_6', name: 'Route 5 (South)' },
			{ id: 'route9_10', name: 'Route 9 (East)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'misty',
	},

	route24_25: {
		id: 'route24_25',
		name: 'Route 24 & 25 (Nugget Bridge)',
		region: 'Kanto',
		type: 'route',
		description: 'The famous golden bridge over the river leading to Bill\'s Sea Cottage.',
		preview: ['bellsprout', 'oddish', 'abra', 'psyduck'],
		connections: [
			{ id: 'cerulean_city', name: 'Cerulean City (South)' },
		],
		wildSpecies: [
			{ species: 'bellsprout', minLevel: 12, maxLevel: 15, weight: 30 },
			{ species: 'oddish', minLevel: 12, maxLevel: 15, weight: 30 },
			{ species: 'abra', minLevel: 10, maxLevel: 14, weight: 20 },
			{ species: 'psyduck', minLevel: 12, maxLevel: 16, weight: 20 },
		],
		trainers: ['swimmer_luis'],
	},

	route5_6: {
		id: 'route5_6',
		name: 'Route 5 & 6',
		region: 'Kanto',
		type: 'route',
		description: 'The scenic north-south highway connecting Cerulean down to Vermilion Port.',
		preview: ['meowth', 'pidgeotto', 'mankey'],
		connections: [
			{ id: 'cerulean_city', name: 'Cerulean City (North)' },
			{ id: 'saffron_city', name: 'Saffron City (Center)' },
			{ id: 'vermilion_city', name: 'Vermilion City (South)' },
		],
		wildSpecies: [
			{ species: 'meowth', minLevel: 13, maxLevel: 17, weight: 40 },
			{ species: 'pidgey', minLevel: 13, maxLevel: 16, weight: 30 },
			{ species: 'mankey', minLevel: 14, maxLevel: 17, weight: 30 },
		],
		trainers: [],
	},

	vermilion_city: {
		id: 'vermilion_city',
		name: 'Vermilion City',
		region: 'Kanto',
		type: 'town',
		description: 'The port of exquisite sunsets! Home to the luxury cruise liner S.S. Anne and Lt. Surge\'s Gym!',
		preview: ['voltorb', 'pikachu', 'machop'],
		connections: [
			{ id: 'route5_6', name: 'Route 6 (North)' },
			{ id: 'route11_digletts', name: 'Route 11 & Diglett\'s Cave (East)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'ltsurge',
	},

	route11_digletts: {
		id: 'route11_digletts',
		name: 'Route 11 & Diglett\'s Cave',
		region: 'Kanto',
		type: 'dungeon',
		description: 'A tunnel bored through the bedrock by burrowing Diglett, connecting Vermilion to Route 2.',
		preview: ['diglett', 'dugtrio', 'drowzee'],
		connections: [
			{ id: 'vermilion_city', name: 'Vermilion City (West)' },
			{ id: 'route12_15', name: 'Route 12 Silence Bridge (East)' },
			{ id: 'route2', name: 'Route 2 Exit (West Exit)' },
		],
		wildSpecies: [
			{ species: 'diglett', minLevel: 15, maxLevel: 22, weight: 65 },
			{ species: 'dugtrio', minLevel: 29, maxLevel: 31, weight: 10 },
			{ species: 'drowzee', minLevel: 14, maxLevel: 18, weight: 25 },
		],
		trainers: ['sailor_huey', 'gentleman_tucker'],
	},

	route9_10: {
		id: 'route9_10',
		name: 'Route 9 & 10',
		region: 'Kanto',
		type: 'route',
		description: 'A rugged canyon along a rushing river leading directly to Rock Tunnel.',
		preview: ['voltorb', 'magnemite', 'machop'],
		connections: [
			{ id: 'cerulean_city', name: 'Cerulean City (West)' },
			{ id: 'rock_tunnel', name: 'Rock Tunnel (South)' },
		],
		wildSpecies: [
			{ species: 'voltorb', minLevel: 16, maxLevel: 20, weight: 35 },
			{ species: 'magnemite', minLevel: 16, maxLevel: 21, weight: 35 },
			{ species: 'machop', minLevel: 16, maxLevel: 20, weight: 30 },
		],
		trainers: [],
	},

	rock_tunnel: {
		id: 'rock_tunnel',
		name: 'Rock Tunnel',
		region: 'Kanto',
		type: 'dungeon',
		description: 'A pitch-black natural labyrinth winding deep beneath the mountains to Lavender Town.',
		preview: ['onix', 'machop', 'geodude', 'zubat'],
		connections: [
			{ id: 'route9_10', name: 'Route 9 & 10 (North)' },
			{ id: 'lavender_town', name: 'Lavender Town (South)' },
		],
		wildSpecies: [
			{ species: 'zubat', minLevel: 16, maxLevel: 21, weight: 35 },
			{ species: 'geodude', minLevel: 16, maxLevel: 21, weight: 35 },
			{ species: 'machop', minLevel: 17, maxLevel: 22, weight: 20 },
			{ species: 'onix', minLevel: 18, maxLevel: 23, weight: 10 },
		],
		trainers: [],
	},

	lavender_town: {
		id: 'lavender_town',
		name: 'Lavender Town',
		region: 'Kanto',
		type: 'town',
		description: 'The noble purple town. Towering above the houses is the sacred Pokémon Tower.',
		preview: ['gastly', 'haunter', 'cubone'],
		connections: [
			{ id: 'rock_tunnel', name: 'Rock Tunnel (North)' },
			{ id: 'pokemon_tower', name: 'Pokémon Tower (East)' },
			{ id: 'route7_8', name: 'Route 8 (West)' },
			{ id: 'route12_15', name: 'Route 12 (South)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: false,
	},

	pokemon_tower: {
		id: 'pokemon_tower',
		name: 'Pokémon Tower',
		region: 'Kanto',
		type: 'dungeon',
		description: 'A multi-story monument honoring departed Pokémon, inhabited by spectral Ghost Pokémon.',
		preview: ['gastly', 'haunter', 'cubone', 'marowak'],
		connections: [
			{ id: 'lavender_town', name: 'Lavender Town (Exit)' },
		],
		wildSpecies: [
			{ species: 'gastly', minLevel: 18, maxLevel: 24, weight: 60 },
			{ species: 'haunter', minLevel: 23, maxLevel: 26, weight: 15 },
			{ species: 'cubone', minLevel: 18, maxLevel: 22, weight: 25 },
		],
		trainers: [],
	},

	route7_8: {
		id: 'route7_8',
		name: 'Route 7 & 8',
		region: 'Kanto',
		type: 'route',
		description: 'The central corridor connecting Lavender Town straight to Celadon City.',
		preview: ['growlithe', 'vulpix', 'meowth', 'abra'],
		connections: [
			{ id: 'lavender_town', name: 'Lavender Town (East)' },
			{ id: 'saffron_city', name: 'Saffron City (Center)' },
			{ id: 'celadon_city', name: 'Celadon City (West)' },
		],
		wildSpecies: [
			{ species: 'growlithe', minLevel: 18, maxLevel: 22, weight: 30 },
			{ species: 'vulpix', minLevel: 18, maxLevel: 22, weight: 30 },
			{ species: 'meowth', minLevel: 18, maxLevel: 21, weight: 25 },
			{ species: 'abra', minLevel: 18, maxLevel: 21, weight: 15 },
		],
		trainers: ['gambler_rich'],
	},

	celadon_city: {
		id: 'celadon_city',
		name: 'Celadon City',
		region: 'Kanto',
		type: 'town',
		description: 'The dazzling metropolis! Home to the Department Store, Game Corner, and Erika\'s Grass Gym.',
		preview: ['eevee', 'tangela', 'vileplume', 'porygon'],
		connections: [
			{ id: 'route7_8', name: 'Route 8 (East)' },
			{ id: 'saffron_city', name: 'Saffron City (East Gate)' },
			{ id: 'route16_17_18', name: 'Cycling Road (West)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'erika',
	},

	saffron_city: {
		id: 'saffron_city',
		name: 'Saffron City',
		region: 'Kanto',
		type: 'town',
		description: 'The shining golden heart of Kanto! Headquarters of Silph Co. and Sabrina\'s Psychic Gym.',
		preview: ['alakazam', 'hitmonlee', 'hitmonchan', 'lapras'],
		connections: [
			{ id: 'celadon_city', name: 'Celadon City (West)' },
			{ id: 'cerulean_city', name: 'Cerulean City (North)' },
			{ id: 'vermilion_city', name: 'Vermilion City (South)' },
			{ id: 'lavender_town', name: 'Lavender Town (East)' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'sabrina',
	},

	route16_17_18: {
		id: 'route16_17_18',
		name: 'Cycling Road (Routes 16-18)',
		region: 'Kanto',
		type: 'route',
		description: 'A steep coastal highway where the ocean breeze carries you south toward Fuchsia City.',
		preview: ['doduo', 'grimer', 'koffing', 'fearow'],
		connections: [
			{ id: 'celadon_city', name: 'Celadon City (North)' },
			{ id: 'fuchsia_city', name: 'Fuchsia City (South)' },
		],
		wildSpecies: [
			{ species: 'doduo', minLevel: 24, maxLevel: 28, weight: 35 },
			{ species: 'fearow', minLevel: 25, maxLevel: 29, weight: 25 },
			{ species: 'grimer', minLevel: 26, maxLevel: 29, weight: 20 },
			{ species: 'koffing', minLevel: 26, maxLevel: 29, weight: 20 },
		],
		trainers: ['biker_alex'],
	},

	route12_15: {
		id: 'route12_15',
		name: 'Silence Bridge & Routes 12-15',
		region: 'Kanto',
		type: 'route',
		description: 'A vast network of wooden piers and coastlines where anglers fish and Snorlax naps.',
		preview: ['snorlax', 'magikarp', 'tentacool', 'krabby'],
		connections: [
			{ id: 'lavender_town', name: 'Lavender Town (North)' },
			{ id: 'route11_digletts', name: 'Route 11 (West)' },
			{ id: 'fuchsia_city', name: 'Fuchsia City (West)' },
		],
		wildSpecies: [
			{ species: 'bellsprout', minLevel: 24, maxLevel: 28, weight: 30 },
			{ species: 'oddish', minLevel: 24, maxLevel: 28, weight: 30 },
			{ species: 'venonat', minLevel: 24, maxLevel: 28, weight: 25 },
			{ species: 'snorlax', minLevel: 30, maxLevel: 30, weight: 15 },
		],
		trainers: ['psychic_johan'],
	},

	fuchsia_city: {
		id: 'fuchsia_city',
		name: 'Fuchsia City',
		region: 'Kanto',
		type: 'town',
		description: 'Behold! A town adorned with pink blossoms! Gateway to the Safari Zone and Koga\'s Poison Gym.',
		preview: ['koffing', 'weezing', 'kangaskhan'],
		connections: [
			{ id: 'route16_17_18', name: 'Cycling Road (Northwest)' },
			{ id: 'route12_15', name: 'Routes 12-15 (East)' },
			{ id: 'safarizone', name: 'Safari Zone (North)' },
			{ id: 'seafoam_islands', name: 'Route 19 Sea Route (South)', reqKeyItem: 'surfboard' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'koga',
	},

	safarizone: {
		id: 'safarizone',
		name: 'Safari Zone (Kanto)',
		region: 'Kanto',
		type: 'dungeon',
		description: 'An untamed wildlife sanctuary teeming with rare Pokémon, including Dratini, Scyther, and Chansey.',
		preview: ['dratini', 'chansey', 'scyther', 'pinsir', 'tauros'],
		connections: [
			{ id: 'fuchsia_city', name: 'Fuchsia City (Exit)' },
		],
		wildSpecies: [
			{ species: 'dratini', minLevel: 15, maxLevel: 25, weight: 15 },
			{ species: 'chansey', minLevel: 26, maxLevel: 30, weight: 15 },
			{ species: 'scyther', minLevel: 25, maxLevel: 29, weight: 20 },
			{ species: 'pinsir', minLevel: 25, maxLevel: 29, weight: 20 },
			{ species: 'tauros', minLevel: 25, maxLevel: 28, weight: 15 },
			{ species: 'kangaskhan', minLevel: 25, maxLevel: 28, weight: 15 },
		],
		trainers: [],
	},

	seafoam_islands: {
		id: 'seafoam_islands',
		name: 'Seafoam Islands (Routes 19-20)',
		region: 'Kanto',
		type: 'dungeon',
		description: 'A pair of freezing glacial caverns dividing the ocean between Fuchsia and Cinnabar. Home to Articuno!',
		preview: ['seel', 'dewgong', 'slowpoke', 'articuno'],
		connections: [
			{ id: 'fuchsia_city', name: 'Fuchsia City (East)' },
			{ id: 'cinnabar_island', name: 'Cinnabar Island (West)' },
		],
		wildSpecies: [
			{ species: 'tentacool', minLevel: 28, maxLevel: 33, weight: 35 },
			{ species: 'seel', minLevel: 30, maxLevel: 34, weight: 30 },
			{ species: 'slowpoke', minLevel: 28, maxLevel: 33, weight: 20 },
			{ species: 'dewgong', minLevel: 34, maxLevel: 38, weight: 14 },
			{ species: 'articuno', minLevel: 50, maxLevel: 50, weight: 1 },
		],
		trainers: [],
	},

	cinnabar_island: {
		id: 'cinnabar_island',
		name: 'Cinnabar Island',
		region: 'Kanto',
		type: 'town',
		description: 'The fiery island town perched upon a dormant volcano! Home to Blaine\'s Fire Gym and Pokémon Lab.',
		preview: ['magmar', 'ponyta', 'koffing', 'arcanine'],
		connections: [
			{ id: 'seafoam_islands', name: 'Seafoam Islands (East)' },
			{ id: 'route21', name: 'Route 21 Ocean (North)', reqKeyItem: 'surfboard' },
		],
		wildSpecies: [],
		trainers: [],
		hasCenter: true,
		hasMart: true,
		hasGym: true,
		gymLeaderId: 'blaine',
	},

	route21: {
		id: 'route21',
		name: 'Route 21 (Pallet Ocean)',
		region: 'Kanto',
		type: 'route',
		description: 'A calm blue ocean channel connecting Cinnabar Island straight back home to Pallet Town.',
		preview: ['tentacruel', 'staryu', 'gyarados'],
		connections: [
			{ id: 'cinnabar_island', name: 'Cinnabar Island (South)' },
			{ id: 'pallet_town', name: 'Pallet Town (North)' },
		],
		wildSpecies: [
			{ species: 'tentacool', minLevel: 30, maxLevel: 35, weight: 35 },
			{ species: 'staryu', minLevel: 30, maxLevel: 35, weight: 30 },
			{ species: 'tentacruel', minLevel: 35, maxLevel: 40, weight: 20 },
			{ species: 'gyarados', minLevel: 35, maxLevel: 40, weight: 15 },
		],
		trainers: [],
	},

	victory_road: {
		id: 'victory_road',
		name: 'Victory Road & Route 23',
		region: 'Kanto',
		type: 'dungeon',
		description: 'The ultimate proving ground! A colossal cavern of rock where only badge-holders may walk. Home to Moltres!',
		preview: ['machamp', 'graveler', 'onix', 'moltres'],
		connections: [
			{ id: 'route22', name: 'Route 22 (South)' },
			{ id: 'indigo_plateau', name: 'Indigo Plateau (North)', reqBadge: 'earth' },
		],
		wildSpecies: [
			{ species: 'graveler', minLevel: 40, maxLevel: 45, weight: 35 },
			{ species: 'machoke', minLevel: 42, maxLevel: 46, weight: 30 },
			{ species: 'onix', minLevel: 40, maxLevel: 45, weight: 20 },
			{ species: 'golbat', minLevel: 40, maxLevel: 44, weight: 14 },
			{ species: 'moltres', minLevel: 50, maxLevel: 50, weight: 1 },
		],
		trainers: ['blackbelt_nob', 'acetrainer_kelly'],
	},

	indigo_plateau: {
		id: 'indigo_plateau',
		name: 'Indigo Plateau (Pokémon League)',
		region: 'Kanto',
		type: 'town',
		description: 'The pinnacle of achievement for every trainer! The Pokémon League headquarters where the Elite Four and Champion await.',
		preview: ['dragonite', 'charizard', 'gengar', 'alakazam'],
		connections: [
			{ id: 'victory_road', name: 'Victory Road (South)' },
		],
		wildSpecies: [],
		trainers: ['lorelei', 'bruno', 'agatha', 'lance', 'champion_blue'],
		hasCenter: true,
		hasMart: true,
		hasGym: false,
	},
};

export function getLocationOrNull(locStr: string): SGLocation | null {
	if (!locStr) return null;
	const trimmed = locStr.trim();
	if (!trimmed) return null;

	if (SG_LOCATIONS[trimmed]) return SG_LOCATIONS[trimmed];

	const targetId = toID(trimmed);
	if (!targetId) return null;

	if (SG_LOCATIONS[targetId]) return SG_LOCATIONS[targetId];

	for (const loc of Object.values(SG_LOCATIONS)) {
		if (toID(loc.id) === targetId || toID(loc.name) === targetId) {
			return loc;
		}
	}

	for (const loc of Object.values(SG_LOCATIONS)) {
		if (toID(loc.name).includes(targetId) || toID(loc.id).includes(targetId)) {
			return loc;
		}
	}

	return null;
}

export function getLocation(locStr: string): SGLocation {
	const loc = getLocationOrNull(locStr);
	return loc || SG_LOCATIONS.pallet_town;
}
