export interface SGLocation {
	id: string;
	name: string;
	gen: number;
	region: string;
	preview: string[];
	species: string[];
}

export const SG_LOCATIONS: Record<string, SGLocation> = {
	route1_kanto: {
		id: 'route1_kanto',
		name: 'Route 1 (Kanto)',
		gen: 1,
		region: 'Kanto',
		preview: ['pidgey', 'rattata', 'oddish', 'mankey'],
		species: [
			'pidgey', 'rattata', 'caterpie', 'weedle', 'spearow',
			'nidoranf', 'nidoranm', 'oddish', 'bellsprout', 'mankey',
			'poliwag', 'abra', 'meowth', 'psyduck', 'geodude', 'zubat',
		],
	},
	route29_johto: {
		id: 'route29_johto',
		name: 'Route 29 (Johto)',
		gen: 2,
		region: 'Johto',
		preview: ['sentret', 'hoothoot', 'mareep', 'wooper'],
		species: [
			'sentret', 'hoothoot', 'ledyba', 'spinarak', 'mareep',
			'wooper', 'marill', 'pineco', 'snubbull', 'teddiursa',
			'phanpy', 'hoppip', 'aipom', 'yanma', 'swinub', 'houndour',
		],
	},
	route101_hoenn: {
		id: 'route101_hoenn',
		name: 'Route 101 (Hoenn)',
		gen: 3,
		region: 'Hoenn',
		preview: ['zigzagoon', 'poochyena', 'wurmple', 'taillow'],
		species: [
			'zigzagoon', 'poochyena', 'wurmple', 'taillow', 'wingull',
			'ralts', 'shroomish', 'slakoth', 'whismur', 'skitty',
			'electrike', 'plusle', 'minun', 'gulpin', 'spoink', 'spinda',
		],
	},
	route201_sinnoh: {
		id: 'route201_sinnoh',
		name: 'Route 201 (Sinnoh)',
		gen: 4,
		region: 'Sinnoh',
		preview: ['starly', 'bidoof', 'shinx', 'buizel'],
		species: [
			'starly', 'bidoof', 'kricketot', 'shinx', 'budew',
			'buizel', 'cherubi', 'shellos', 'buneary', 'glameow',
			'stunky', 'bronzor', 'gible', 'hippopotas', 'croagunk', 'snover',
		],
	},
	route1_unova: {
		id: 'route1_unova',
		name: 'Route 1 (Unova)',
		gen: 5,
		region: 'Unova',
		preview: ['patrat', 'lillipup', 'purrloin', 'blitzle'],
		species: [
			'patrat', 'lillipup', 'purrloin', 'pidove', 'blitzle',
			'roggenrola', 'woobat', 'drilbur', 'timburr', 'tympole',
			'sewaddle', 'venipede', 'cottonee', 'petilil', 'sandile', 'darumaka',
		],
	},
	route2_kalos: {
		id: 'route2_kalos',
		name: 'Route 2 (Kalos)',
		gen: 6,
		region: 'Kalos',
		preview: ['fletchling', 'bunnelby', 'scatterbug', 'litleo'],
		species: [
			'fletchling', 'bunnelby', 'scatterbug', 'litleo', 'flabebe',
			'skiddo', 'pancham', 'espurr', 'honedge', 'spritzee',
			'swirlix', 'inkay', 'helioptile', 'tyrunt', 'amaura', 'goomy',
		],
	},
	route1_alola: {
		id: 'route1_alola',
		name: 'Route 1 (Alola)',
		gen: 7,
		region: 'Alola',
		preview: ['pikipek', 'yungoos', 'grubbin', 'rockruff'],
		species: [
			'pikipek', 'yungoos', 'grubbin', 'rockruff', 'cutiefly',
			'mareanie', 'mudbray', 'dewpider', 'fomantis', 'morelull',
			'salandit', 'stufful', 'bounsweet', 'comfey', 'wimpod', 'sandygast',
		],
	},
	route1_galar: {
		id: 'route1_galar',
		name: 'Route 1 (Galar)',
		gen: 8,
		region: 'Galar',
		preview: ['rookidee', 'skwovet', 'nickit', 'wooloo'],
		species: [
			'rookidee', 'skwovet', 'nickit', 'wooloo', 'chewtle',
			'yamper', 'rolycoly', 'applin', 'silicobra', 'arrokuda',
			'toxel', 'sizzlipede', 'clobbopus', 'sinistea', 'hatenna', 'impidimp',
		],
	},
	pocopath_paldea: {
		id: 'pocopath_paldea',
		name: 'Poco Path (Paldea)',
		gen: 9,
		region: 'Paldea',
		preview: ['lechonk', 'tarountula', 'pawmi', 'fidough'],
		species: [
			'lechonk', 'tarountula', 'nymble', 'pawmi', 'tandemaus',
			'fidough', 'smoliv', 'squawkabilly', 'nacli', 'charcadet',
			'tadbulb', 'wattrel', 'maschiff', 'shroodle', 'capsakid', 'tinkatink',
		],
	},
	safarizone: {
		id: 'safarizone',
		name: 'Safari Zone (All-Gens)',
		gen: 0,
		region: 'Wilds',
		preview: ['pikachu', 'eevee', 'dratini', 'larvitar'],
		species: [
			'pikachu', 'eevee', 'dratini', 'snorlax',
			'larvitar', 'heracross', 'marill', 'togepi',
			'bagon', 'beldum', 'ralts', 'feebas',
			'gible', 'riolu', 'lucario', 'rotom',
			'zorua', 'axew', 'deino', 'litwick',
			'froakie', 'hawlucha', 'honedge', 'noibat',
			'mimikyu', 'rockruff', 'jangmoo', 'mareanie',
			'dreepy', 'rookidee', 'snom', 'morpeko',
			'charcadet', 'tinkatink', 'frigibax', 'glimmet',
		],
	},
};

export function getLocationOrNull(locStr: string): SGLocation | null {
	if (!locStr) return null;
	const trimmed = locStr.trim();
	if (!trimmed) return null;

	// Direct match in dictionary
	if (SG_LOCATIONS[trimmed]) return SG_LOCATIONS[trimmed];

	const targetId = toID(trimmed);
	if (!targetId) return null;

	// Direct match by toID
	if (SG_LOCATIONS[targetId]) return SG_LOCATIONS[targetId];

	// Match by toID of id or name
	for (const loc of Object.values(SG_LOCATIONS)) {
		if (toID(loc.id) === targetId || toID(loc.name) === targetId) {
			return loc;
		}
	}

	// Case-insensitive match
	const lower = trimmed.toLowerCase();
	for (const loc of Object.values(SG_LOCATIONS)) {
		if (loc.id.toLowerCase() === lower || loc.name.toLowerCase() === lower) {
			return loc;
		}
	}

	// Partial match: region name, or name substring
	for (const loc of Object.values(SG_LOCATIONS)) {
		if (targetId.includes(toID(loc.region)) || toID(loc.name).includes(targetId) || toID(loc.id).includes(targetId)) {
			return loc;
		}
	}

	return null;
}

export function getLocation(locStr: string): SGLocation {
	const loc = getLocationOrNull(locStr);
	return loc || SG_LOCATIONS.route1_kanto;
}
