import { FS } from '../../../lib';
import { type SGPlayer } from './types';
import { SGItems } from './items';

const DIR = 'config/sggame';
FS(DIR).mkdirpSync();

export const SGTimeouts = new Map<string, NodeJS.Timeout>();

export const Database = {
	load(userid: string): SGPlayer | null {
		// If they run a command, cancel any pending auto-clears so we don't mess up their new screen
		if (SGTimeouts.has(userid)) {
			clearTimeout(SGTimeouts.get(userid));
			SGTimeouts.delete(userid);
		}
		try {
			const data = FS(`${DIR}/${userid}.json`).readSync();
			const player = JSON.parse(data) as SGPlayer;
			if (player.introState === undefined) {
				player.introState = player.party?.length > 0 ? 3 : 0;
			}
			if (player.money === undefined) {
				player.money = 1000;
			}
			if (!player.location || player.location === 'Route 1 (Kanto)' || player.location === 'Route 1') {
				player.location = 'pallet_town';
			}
			if (!player.party) player.party = [];
			if (!player.pc) player.pc = [];
			if (!player.bag) player.bag = {};
			if (player.bag['expall'] === undefined) {
				player.bag['expall'] = 1;
			}
			if (!player.badges) player.badges = [];
			if (!player.defeatedTrainers) player.defeatedTrainers = [];
			if (!player.keyItems) player.keyItems = [];
			if (!player.pokedex) {
				player.pokedex = { seen: [], caught: [] };
			}
			if (!player.stats) {
				player.stats = { wildBattlesWon: 0, trainersBeaten: 0, pvpWins: 0, pvpLosses: 0 };
			}
			if (!player.visitedLocations) {
				player.visitedLocations = ['pallet_town'];
				if (player.location && !player.visitedLocations.includes(player.location)) {
					player.visitedLocations.push(player.location);
				}
				const badgeTownMap: Record<string, string> = {
					boulder: 'pewter_city',
					cascade: 'cerulean_city',
					thunder: 'vermilion_city',
					rainbow: 'celadon_city',
					soul: 'fuchsia_city',
					marsh: 'saffron_city',
					volcano: 'cinnabar_island',
					earth: 'viridian_city',
				};
				for (const b of player.badges || []) {
					const town = badgeTownMap[b];
					if (town && !player.visitedLocations.includes(town)) {
						player.visitedLocations.push(town);
					}
				}
			}
			if (player.badges?.includes('thunder') && !player.bag['fly_pass']) {
				player.bag['fly_pass'] = 1;
			}

			// Enforce max item quantities
			if (player.bag) {
				for (const item in player.bag) {
					const itemData = SGItems[item];
					if (itemData) {
						if (itemData.category === 'Key Items' || itemData.category === 'Held Items' || itemData.category === 'TMs') {
							if (player.bag[item] > 1) player.bag[item] = 1;
						} else {
							if (player.bag[item] > 99) player.bag[item] = 99;
						}
					}
				}
			}

			// Extract lastMessage and clear it from DB so it only shows once
			if (player.lastMessage) {
				const msg = player.lastMessage;
				player.lastMessage = undefined;
				Database.save(userid, player); // Clear from disk
				player.lastMessage = msg; // Keep in memory for this render cycle
			}

			return player;
		} catch (e) {
			return null;
		}
	},
	save(userid: string, player: SGPlayer) {
		FS(`${DIR}/${userid}.json`).writeSync(JSON.stringify(player, null, 2));
	},
	create(userid: string): SGPlayer {
		const player: SGPlayer = {
			userid,
			party: [],
			pc: [],
			bag: {
				pokeball: 10,
				potion: 5,
				expall: 1,
			},
			money: 1000,
			location: 'pallet_town',
			introState: 0,
			badges: [],
			defeatedTrainers: [],
			keyItems: [],
			visitedLocations: ['pallet_town'],
			pokedex: {
				seen: [],
				caught: [],
			},
			stats: {
				wildBattlesWon: 0,
				trainersBeaten: 0,
				pvpWins: 0,
				pvpLosses: 0,
			},
		};
		this.save(userid, player);
		return player;
	},
	getAllPlayers(): SGPlayer[] {
		const players: SGPlayer[] = [];
		try {
			const files = FS(DIR).readdirSync();
			for (const file of files) {
				if (file.endsWith('.json')) {
					try {
						const raw = FS(`${DIR}/${file}`).readSync();
						const p = JSON.parse(raw) as SGPlayer;
						if (p && p.userid) players.push(p);
					} catch (e) {}
				}
			}
		} catch (e) {}
		return players;
	},
};
