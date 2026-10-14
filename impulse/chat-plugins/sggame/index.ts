import { Database, SGTimeouts } from './database';
import { SGUtils, getLevelCap, BADGE_LEVEL_CAPS } from './pokemon';
import { SGBattle } from './battle';
import { SGRenderer } from './render';
import { Utils } from '../../../lib';
import { UtilityBattleResolver } from '../../utils/battle';
import { calculateCatchShakes } from '../../utils/catch';
import { SGItems } from './items';
import { getLevelUpEvo, getItemEvolution } from '../../utils/evolutions';
import { getMovesLearnedBetween } from '../../utils/moves';
import { ALL_STARTERS } from './data';
import { getLocation, getLocationOrNull, SG_LOCATIONS } from './locations';
import { getTrainer, SG_TRAINERS } from './trainers';

const WildEncounters = new Map<string, any>();
const PendingTrades = new Map<string, { fromUser: string, toUser: string, fromSlot: number, toSlot: number, timestamp: number }>();
const PendingPvP = new Map<string, { fromUser: string, toUser: string, timestamp: number }>();

function scheduleDismiss(user: User, room: Room | null, screen: string, context: any) {
	if (SGTimeouts.has(user.id)) clearTimeout(SGTimeouts.get(user.id));
	SGTimeouts.set(user.id, setTimeout(() => {
		const player = Database.load(user.id);
		if (player) {
			player.lastMessage = undefined;
			const msg = `|uhtmlchange|sggame|${SGRenderer.renderUI(player, screen, context)}`;
			if (room) user.sendTo(room, msg);
			else user.send(msg);
		}
	}, 3000));
}

export function getConsoleHtml(user: User): string {
	let player = Database.load(user.id);
	if (!player) {
		player = Database.create(user.id);
	}

	let screen = 'home';
	if (player.introState === 0) {
		player.introState = 1;
		Database.save(user.id, player);
		screen = 'intro';
	} else if (player.introState === 1) {
		screen = 'intro';
	} else if (player.introState === 2) {
		screen = 'pick_starter';
	}

	return SGRenderer.renderUI(player, screen);
}

export const commands: Chat.ChatCommands = {
	sg: 'sggame',
	sggame: {
		''(target, room, user) {
			this.sendReply(`|uhtml|sggame|${getConsoleHtml(user)}`);
		},

		dismissmsg(target, room, user) {
			const player = Database.load(user.id);
			if (!player) return;
			const targetParts = target.split('|');
			const screen = targetParts[0] || 'home';
			let context = undefined;
			if (targetParts[1]) {
				try { context = JSON.parse(targetParts[1].replace(/&quot;/g, '"')); } catch (e) {}
			}
			player.lastMessage = undefined;
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, screen, context)}`);
		},

		home(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'home')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'home', undefined);
		},

		trainers(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'trainers')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'trainers', undefined);
		},

		gym(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'gym')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'gym', undefined);
		},

		badges: 'badgecase',
		badgecase(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'badges')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'badges', undefined);
		},

		leaderboard: 'top',
		top(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'leaderboard')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'leaderboard', undefined);
		},

		pc(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");
			if (!player.pc) player.pc = [];

			const args = target.split(' ').map(x => x.trim());
			const action = args[0] || 'box';

			const context: any = { box: 0 };

			if (action === 'box') {
				context.box = parseInt(args[1]) || 0;
			} else if (action === 'select') {
				const source = args[1];
				const index = parseInt(args[2]);

				if (source === 'pc' && !isNaN(index)) {
					context.box = Math.floor(index / 30);
				}
				context.selected = { source, index };
			} else if (action === 'release') {
				const source = args[1];
				const index = parseInt(args[2]);
				if (source === 'party') {
					if (player.party.length <= 1) {
						player.lastMessage = "You cannot release your last Pokemon!";
					} else {
						player.lastMessage = `Released ${Dex.species.get(player.party[index].species).name}! Bye bye!`;
						player.party.splice(index, 1);
					}
				} else if (source === 'pc') {
					player.lastMessage = `Released ${Dex.species.get(player.pc[index].species).name}! Bye bye!`;
					player.pc.splice(index, 1);
					context.box = Math.floor(index / 30);
				}
				Database.save(user.id, player);
			} else if (action === 'deposit') {
				const index = parseInt(args[1]);
				if (player.party.length <= 1) {
					player.lastMessage = "You cannot deposit your last Pokemon!";
				} else if (player.party[index]) {
					player.lastMessage = `Deposited ${Dex.species.get(player.party[index].species).name} in Box ${Math.floor(player.pc.length / 30) + 1}!`;
					player.pc.push(player.party[index]);
					player.party.splice(index, 1);
					Database.save(user.id, player);
				}
			} else if (action === 'withdraw') {
				const index = parseInt(args[1]);
				if (player.party.length >= 6) {
					player.lastMessage = "Your party is full!";
				} else if (player.pc[index]) {
					player.lastMessage = `Withdrew ${Dex.species.get(player.pc[index].species).name}!`;
					player.party.push(player.pc[index]);
					player.pc.splice(index, 1);
					Database.save(user.id, player);
					context.box = Math.floor(index / 30);
				}
			}

			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'pc', context)}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'pc', context);
		},

		pickstarter(target, room, user) {
			const player = Database.load(user.id);
			if (!player || (player.introState !== 1 && player.introState !== 2)) return this.errorReply("You cannot do this right now.");

			const gen = Math.min(9, Math.max(1, parseInt(target) || 1));
			player.introState = 2;
			Database.save(user.id, player);
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'pick_starter', { gen })}`);
		},

		starter(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState !== 2) return this.errorReply("You cannot do this right now.");

			const choice = toID(target);
			if (!ALL_STARTERS.includes(choice)) {
				return this.errorReply("Invalid starter choice.");
			}

			const starter = SGUtils.generateWild(choice, 5);
			player.party.push(starter);
			player.introState = 3;
			player.location = 'pallet_town';

			if (!player.pokedex) player.pokedex = { seen: [], caught: [] };
			if (!player.pokedex.seen.includes(choice)) player.pokedex.seen.push(choice);
			if (!player.pokedex.caught.includes(choice)) player.pokedex.caught.push(choice);

			Database.save(user.id, player);

			player.lastMessage = `You chose ${Dex.species.get(choice).name}! Your Kanto journey begins in Pallet Town!`;
			Database.save(user.id, player);
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'home')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'home', undefined);
		},

		party(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const args = target.split(' ').map(x => x.trim());
			const action = args[0] || 'list';
			const context: any = {};

			if (action === 'select') {
				const index = parseInt(args[1]);
				if (!isNaN(index) && player.party[index]) {
					context.selected = index;
				}
			} else if (action === 'move') {
				const from = parseInt(args[1]);
				const to = parseInt(args[2]);

				if (!isNaN(from) && !isNaN(to) && player.party[from]) {
					const temp = player.party[from];
					player.party[from] = player.party[to];
					player.party[to] = temp;
					player.party = player.party.filter(p => p !== undefined);

					Database.save(user.id, player);
					context.selected = Math.min(to, player.party.length - 1);
				} else if (!isNaN(from) && isNaN(to) && player.party[from]) {
					context.moving = from;
				}
			} else if (action === 'takeitem') {
				const targetIdx = parseInt(args[1]);
				if (!isNaN(targetIdx) && player.party[targetIdx]) {
					const p = player.party[targetIdx];
					if (p.item) {
						if (!player.bag[p.item]) player.bag[p.item] = 0;
						player.bag[p.item]++;
						const itemName = (Dex.items.get(p.item).exists ? Dex.items.get(p.item).name : (SGItems[p.item]?.name || p.item));
						p.item = undefined;

						player.lastMessage = `Took the ${itemName} from ${Dex.species.get(p.species).name}!`;
						Database.save(user.id, player);
					}
					context.selected = targetIdx;
				}
			}

			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'party', context)}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'party', context);
		},

		bag(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const args = target.split(' ').map(s => s.trim());
			const action = args[0] || 'view';
			const context: any = { category: 'Pokeballs' };

			if (action === 'cat') {
				context.category = args.slice(1).join(' ') || 'Pokeballs';
			} else if (action === 'use') {
				const item = args[1];
				const targetIdx = parseInt(args[2]);
				const itemData = SGItems[item];

				if (!player.bag[item] || player.bag[item] <= 0) return this.errorReply("You don't have that item!");

				if (itemData && (itemData.category === 'Medicine' || itemData.category === 'TMs' || itemData.category === 'Evolution')) {
					if (isNaN(targetIdx)) {
						context.category = itemData.category;
						context.usingItem = item;
					} else {
						const p = player.party[targetIdx];
						if (!p) return this.errorReply("Invalid Pokemon slot.");

						if (itemData.category === 'Evolution') {
							const evoSpecies = getItemEvolution(p.species, item);
							if (!evoSpecies) {
								this.errorReply(`It won't have any effect on ${Dex.species.get(p.species).name}!`);
								context.category = itemData.category;
								context.usingItem = item;
							} else {
								player.bag[item]--;
								if (!player.pendingEvolutions) player.pendingEvolutions = [];
								player.pendingEvolutions.push({ partyIndex: targetIdx, evoSpecies });
								Database.save(user.id, player);
								return this.parse('/sg continue');
							}
						} else if (itemData.category === 'TMs') {
							const moveId = itemData.moveId;
							if (!moveId) return this.errorReply("This TM has no associated move.");

							player.pendingMoves = player.pendingMoves || [];
							player.pendingMoves.push({ partyIndex: targetIdx, move: moveId });
							Database.save(user.id, player);

							return this.parse('/sg continue');
						} else if (itemData.revive) {
							if (p.hp > 0) {
								this.errorReply(`${Dex.species.get(p.species).name} is not fainted!`);
								context.category = itemData.category;
								context.usingItem = item;
							} else {
								const healAmt = Math.floor(p.maxHp * ((itemData.healPct || 50) / 100));
								p.hp = healAmt;
								p.status = '';
								player.bag[item]--;
								Database.save(user.id, player);
								context.category = itemData.category;
								player.lastMessage = `Revived ${Dex.species.get(p.species).name}!`; Database.save(user.id, player);
							}
						} else {
							if (p.hp <= 0) {
								this.errorReply(`${Dex.species.get(p.species).name} is fainted and cannot be healed by this item.`);
								context.category = itemData.category;
								context.usingItem = item;
							} else {
								let canCure = false;
								if (itemData.cureStatus && p.status) {
									if (itemData.cureStatus === true) canCure = true;
									else if (typeof itemData.cureStatus === 'string') canCure = (p.status === itemData.cureStatus);
									else if (Array.isArray(itemData.cureStatus)) canCure = itemData.cureStatus.includes(p.status);
								}

								const healsHp = !!itemData.healPct;
								const canHealHp = healsHp && p.hp < p.maxHp;

								if (!canHealHp && !canCure) {
									if (!healsHp) {
										this.errorReply(`It won't have any effect.`);
									} else {
										this.errorReply(`${Dex.species.get(p.species).name} is already at full health!`);
									}
									context.category = itemData.category;
									context.usingItem = item;
								} else {
									if (canHealHp && itemData.healPct) {
										const healAmt = Math.floor(p.maxHp * (itemData.healPct / 100));
										p.hp = Math.min(p.maxHp, p.hp + healAmt);
									}
									if (canCure) {
										p.status = '';
									}
									player.bag[item]--;
									Database.save(user.id, player);

									context.category = itemData.category;
									player.lastMessage = `Used ${(Dex.items.get(item).exists ? Dex.items.get(item).name : itemData.name)} on ${Dex.species.get(p.species).name}!`; Database.save(user.id, player);
								}
							}
						}
					}
				} else {
					context.category = itemData ? itemData.category : 'Pokeballs';
					this.errorReply(`You can't use a ${itemData?.name || item} right now!`);
				}
			} else if (action === 'give') {
				const item = args[1];
				const targetIdx = parseInt(args[2]);
				const itemData = SGItems[item];

				if (!player.bag[item] || player.bag[item] <= 0) return this.errorReply("You don't have that item!");

				if (itemData && itemData.category === 'Held Items') {
					if (isNaN(targetIdx)) {
						context.category = itemData.category;
						context.usingItem = item;
					} else {
						const p = player.party[targetIdx];
						if (!p) return this.errorReply("Invalid Pokemon slot.");

						if (p.item) {
							if (!player.bag[p.item]) player.bag[p.item] = 0;
							player.bag[p.item]++;
						}
						p.item = item;
						player.bag[item]--;

						context.category = itemData.category;
						player.lastMessage = `Gave ${(Dex.items.get(item).exists ? Dex.items.get(item).name : itemData.name)} to ${Dex.species.get(p.species).name}!`;
						Database.save(user.id, player);
					}
				}
			}

			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'bag', context)}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'bag', context);
		},

		heal(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			player.party.forEach(p => SGUtils.heal(p));
			Database.save(user.id, player);

			player.lastMessage = `Nurse Joy: Your Pokémon are fighting fit! We hope to see you again!`;
			Database.save(user.id, player);
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'home')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'home', undefined);
		},

		travel: 'go',
		go(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			if (!target.trim()) {
				return this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'travel')}`);
			}

			const loc = getLocationOrNull(target);
			if (!loc) return this.errorReply("Invalid location.");

			const curLoc = getLocation(player.location);
			if (loc.id === curLoc.id) {
				return this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'home')}`);
			}

			// Ensure visitedLocations is initialized
			if (!player.visitedLocations) {
				player.visitedLocations = ['pallet_town'];
			}
			if (!player.visitedLocations.includes(curLoc.id)) {
				player.visitedLocations.push(curLoc.id);
			}

			// Validate connection or Fast Travel
			const conn = curLoc.connections.find(c => c.id === loc.id);
			const majorTowns = ['pallet_town', 'viridian_city', 'pewter_city', 'cerulean_city', 'vermilion_city', 'lavender_town', 'celadon_city', 'fuchsia_city', 'saffron_city', 'cinnabar_island', 'indigo_plateau'];

			if (conn) {
				// Adjacent on-foot traversal
				if (conn.reqKeyItem && !player.bag?.[conn.reqKeyItem] && !player.keyItems?.includes(conn.reqKeyItem)) {
					const itemName = SGItems[conn.reqKeyItem]?.name || conn.reqKeyItem;
					return this.errorReply(`The path to ${loc.name} is blocked! You need ${itemName}.`);
				}
				if (conn.reqBadge && !player.badges?.includes(conn.reqBadge)) {
					return this.errorReply(`The path to ${loc.name} is blocked! You need the ${conn.reqBadge.toUpperCase()} Badge.`);
				}
			} else {
				// Fast Travel attempt
				const hasFly = player.badges?.includes('thunder') || player.bag?.['fly_pass'] || player.keyItems?.includes('fly_pass');
				if (!hasFly) {
					return this.errorReply(`Fast Travel is locked! You must follow adjacent connected paths on foot, or earn the Thunder Badge from Lt. Surge in Vermilion City to unlock the Kanto Fly Network.`);
				}

				if (curLoc.type === 'dungeon') {
					return this.errorReply(`You cannot fly from inside a cavern or dungeon! Exit to an open route or town first.`);
				}

				if (!majorTowns.includes(loc.id)) {
					return this.errorReply(`The Kanto Fly Network only services major towns and cities.`);
				}

				if (!player.visitedLocations.includes(loc.id)) {
					return this.errorReply(`You haven't visited ${loc.name} yet! You must discover it on foot before you can fly there.`);
				}
			}

			player.location = loc.id;
			if (!player.visitedLocations.includes(loc.id)) {
				player.visitedLocations.push(loc.id);
			}
			player.lastMessage = `Traveled to ${loc.name}!`;
			Database.save(user.id, player);
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'home')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'home', undefined);
		},

		mart: 'shop',
		shop(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const args = target.split(' ').map(s => s.trim());
			const action = args[0] || 'view';
			const context: any = { category: 'Pokeballs' };

			if (action === 'cat') {
				context.category = args.slice(1).join(' ') || 'Pokeballs';
			} else if (action === 'buy') {
				const itemId = toID(args[1]);
				const itemData = SGItems[itemId];
				if (!itemData?.price) return this.errorReply("This item is not for sale.");

				const price = itemData.price;
				context.category = itemData.category;
				if ((player.money || 0) < price) {
					player.lastMessage = `Not enough money! You need $${price}.`;
					Database.save(user.id, player);
					this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'mart', context)}`);
					if (player.lastMessage) scheduleDismiss(user, room, 'mart', context);
					return;
				}

				const maxQty = (itemData.category === 'Held Items' || itemData.category === 'Key Items' || itemData.category === 'TMs') ? 1 : 99;
				if (!player.bag) player.bag = {};
				const currentQty = player.bag[itemId] || 0;
				if (currentQty >= maxQty) {
					player.lastMessage = `You cannot hold any more ${itemData.name}s!`;
					Database.save(user.id, player);
					this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'mart', context)}`);
					if (player.lastMessage) scheduleDismiss(user, room, 'mart', context);
					return;
				}

				player.money = (player.money || 0) - price;
				player.bag[itemId] = currentQty + 1;
				player.lastMessage = `Bought 1 ${itemData.name} for $${price}!`;
				Database.save(user.id, player);
			}

			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'mart', context)}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'mart', context);
		},

		wild: 'explore',
		grass: 'explore',
		explore(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const loc = getLocation(player.location);
			if (!loc.wildSpecies || loc.wildSpecies.length === 0) {
				player.lastMessage = "There are no wild Pokémon roaming in this area.";
				Database.save(user.id, player);
				this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'home')}`);
				return;
			}

			const totalWeight = loc.wildSpecies.reduce((acc, entry) => acc + (entry.weight || 10), 0);
			let rnd = Math.random() * totalWeight;
			let chosen = loc.wildSpecies[0];
			for (const entry of loc.wildSpecies) {
				const w = entry.weight || 10;
				if (rnd < w) {
					chosen = entry;
					break;
				}
				rnd -= w;
			}

			const wildLevel = Math.floor(Math.random() * (chosen.maxLevel - chosen.minLevel + 1)) + chosen.minLevel;
			const wildPoke = SGUtils.generateWild(chosen.species, wildLevel);

			if (!player.pokedex) player.pokedex = { seen: [], caught: [] };
			if (!player.pokedex.seen.includes(wildPoke.species)) {
				player.pokedex.seen.push(wildPoke.species);
				Database.save(user.id, player);
			}

			WildEncounters.set(user.id, wildPoke);
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'wild', { enemy: wildPoke })}`);
		},

		battle(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const args = target.split(' ').map(s => s.trim()).filter(Boolean);
			const subAction = (args[0] || 'wild').toLowerCase();

			const allFainted = player.party.every(p => p.hp <= 0);
			if (allFainted) return this.errorReply("Your party has no healthy Pokémon! Visit a Pokémon Center to heal.");

			if (subAction === 'wild') {
				const wildPoke = WildEncounters.get(user.id);
				if (!wildPoke) return this.errorReply("There is no wild Pokémon to battle!");
				WildEncounters.delete(user.id);
				return SGBattle.startWildEncounter(user, player, wildPoke, room?.roomid || '');
			}

			if (subAction === 'trainer') {
				const trainerId = toID(args[1]);
				const trainer = getTrainer(trainerId);
				if (!trainer) return this.errorReply(`Trainer '${args[1]}' not found.`);
				return SGBattle.startTrainerBattle(user, player, trainer, room?.roomid || '');
			}

			// PvP Battle challenge
			const targetUsername = args[0];
			const targetUser = Users.get(targetUsername);
			if (!targetUser || !targetUser.connected) return this.errorReply(`User '${targetUsername}' is not online.`);
			if (targetUser.id === user.id) return this.errorReply("You cannot battle yourself!");

			const targetPlayer = Database.load(targetUser.id);
			if (!targetPlayer || targetPlayer.introState < 3) return this.errorReply(`${targetUser.name} hasn't started their Kanto adventure yet.`);

			const targetFainted = targetPlayer.party.every(p => p.hp <= 0);
			if (targetFainted) return this.errorReply(`${targetUser.name}'s party has no healthy Pokémon!`);

			const pendingKey = `${targetUser.id}:${user.id}`;
			if (PendingPvP.has(pendingKey)) {
				PendingPvP.delete(pendingKey);
				this.sendReply(`Accepted ${targetUser.name}'s PvP challenge!`);
				targetUser.send(`${user.name} accepted your PvP challenge! Starting battle...`);
				return SGBattle.startPvPBattle(user, targetUser, player, targetPlayer, room?.roomid || '');
			}

			const myKey = `${user.id}:${targetUser.id}`;
			PendingPvP.set(myKey, { fromUser: user.id, toUser: targetUser.id, timestamp: Date.now() });

			this.sendReply(`Challenged ${targetUser.name} to a PvP battle! They can accept with: /sg battle ${user.name}`);
			targetUser.send(`|pm|${user.name}|${targetUser.name}|${user.name} challenged you to an SGGame PvP battle! Type /sg battle ${user.name} to accept!`);
		},

		trade(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const [targetUsername, mySlotStr, theirSlotStr] = target.split(',').map(s => s.trim());
			if (!targetUsername) {
				return this.errorReply("Usage: /sg trade <username>, [myPartySlot 1-6], [theirPartySlot 1-6]");
			}

			const targetUser = Users.get(targetUsername);
			if (!targetUser || !targetUser.connected) return this.errorReply(`User '${targetUsername}' is not online.`);
			if (targetUser.id === user.id) return this.errorReply("You cannot trade with yourself!");

			const targetPlayer = Database.load(targetUser.id);
			if (!targetPlayer || targetPlayer.introState < 3) return this.errorReply(`${targetUser.name} hasn't started their Kanto adventure yet.`);

			const mySlot = parseInt(mySlotStr) - 1;
			const theirSlot = parseInt(theirSlotStr) - 1;

			if (isNaN(mySlot) || mySlot < 0 || mySlot >= player.party.length) {
				return this.errorReply(`Specify your party Pokémon to trade (1-${player.party.length}).`);
			}
			if (isNaN(theirSlot) || theirSlot < 0 || theirSlot >= targetPlayer.party.length) {
				return this.errorReply(`Specify their party Pokémon to receive (1-${targetPlayer.party.length}).`);
			}

			const myMon = player.party[mySlot];
			const theirMon = targetPlayer.party[theirSlot];

			const pendingKey = `${targetUser.id}:${user.id}`;
			const existingTrade = PendingTrades.get(pendingKey);

			if (existingTrade && existingTrade.fromSlot === theirSlot && existingTrade.toSlot === mySlot) {
				PendingTrades.delete(pendingKey);

				player.party[mySlot] = theirMon;
				targetPlayer.party[theirSlot] = myMon;

				if (!player.pokedex) player.pokedex = { seen: [], caught: [] };
				if (!targetPlayer.pokedex) targetPlayer.pokedex = { seen: [], caught: [] };

				if (!player.pokedex.caught.includes(theirMon.species)) player.pokedex.caught.push(theirMon.species);
				if (!player.pokedex.seen.includes(theirMon.species)) player.pokedex.seen.push(theirMon.species);
				if (!targetPlayer.pokedex.caught.includes(myMon.species)) targetPlayer.pokedex.caught.push(myMon.species);
				if (!targetPlayer.pokedex.seen.includes(myMon.species)) targetPlayer.pokedex.seen.push(myMon.species);

				Database.save(user.id, player);
				Database.save(targetUser.id, targetPlayer);

				const myMonName = Dex.species.get(myMon.species).name;
				const theirMonName = Dex.species.get(theirMon.species).name;

				this.sendReply(`Trade complete! Received ${theirMonName} in exchange for ${myMonName}.`);
				targetUser.send(`Trade complete with ${user.name}! Received ${myMonName} in exchange for ${theirMonName}.`);
				return;
			}

			const myKey = `${user.id}:${targetUser.id}`;
			PendingTrades.set(myKey, { fromUser: user.id, toUser: targetUser.id, fromSlot: mySlot, toSlot: theirSlot, timestamp: Date.now() });

			const myMonName = Dex.species.get(myMon.species).name;
			const theirMonName = Dex.species.get(theirMon.species).name;

			this.sendReply(`Offered to trade your ${myMonName} for ${targetUser.name}'s ${theirMonName}. Waiting for confirmation...`);
			targetUser.send(`|pm|${user.name}|${targetUser.name}|${user.name} wants to trade their ${myMonName} for your ${theirMonName}! Type: /sg trade ${user.name}, ${theirSlot + 1}, ${mySlot + 1} to accept!`);
		},

		catch(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			const battleRoom = room;
			if (!battleRoom?.battle) return this.errorReply("You must use this in a battle room!");

			const match = UtilityBattleResolver.activeMatches.get(battleRoom.roomid);
			if (!match || match.userId !== user.id) return this.errorReply("This is not your battle!");
			if (!match.matchContext || match.matchContext.type !== 'wild') return this.errorReply("You can only catch wild Pokemon!");

			const wildPoke = match.matchContext.wildPoke;
			const ball = toID(target) || 'pokeball';

			if (!player.bag[ball] || player.bag[ball] <= 0) return this.errorReply(`You don't have any ${ball}s!`);

			player.bag[ball]--;
			Database.save(user.id, player);

			const turn = (battleRoom as any).lastCatchTurn || 1;
			battleRoom.add(`|uhtmlchange|catchmenu-${turn}|${SGBattle.renderCatchUI(player)}`);

			const state = UtilityBattleResolver.parseBattleState(battleRoom.log?.log || [], player.party);
			const enemyState = state.p2Active.values().next().value;
			if (!enemyState || enemyState.fainted) return this.errorReply("The wild Pokemon has fainted!");

			const shakes = calculateCatchShakes(wildPoke.species, enemyState.hp, enemyState.maxHp, enemyState.status, ball);
			const itemName = SGItems[ball]?.name || ball;

			battleRoom.add(`|c|~|${user.name} threw a ${itemName}!`);

			if (shakes === 3) {
				battleRoom.add(`|c|~|Gotcha! ${Dex.species.get(wildPoke.species).name} was caught!`);

				if (player.party.length < 6) {
					player.party.push(wildPoke);
				} else {
					if (!player.pc) player.pc = [];
					player.pc.push(wildPoke);
					battleRoom.add(`|c|~|${Dex.species.get(wildPoke.species).name} was sent to the PC!`);
				}

				if (!player.pokedex) player.pokedex = { seen: [], caught: [] };
				if (!player.pokedex.caught.includes(wildPoke.species)) player.pokedex.caught.push(wildPoke.species);
				if (!player.pokedex.seen.includes(wildPoke.species)) player.pokedex.seen.push(wildPoke.species);

				Database.save(user.id, player);
				if (match.matchContext) {
					match.matchContext.caught = true;
					if (player.pc.includes(wildPoke)) match.matchContext.sentToPC = true;
				}

				const log = battleRoom.log?.log || [];
				const p1Participants = new Set<string>();
				let p2SwitchIdx = 0;
				for (let i = log.length - 1; i >= 0; i--) {
					if (/^\|(?:switch|drag)\|p2[a-z]:/.test(log[i])) { p2SwitchIdx = i; break; }
				}
				for (let i = p2SwitchIdx; i >= 0; i--) {
					const m = /^\|(?:switch|drag)\|p1[a-z]: [^|]+\|([^|,]+)/.exec(log[i]);
					if (m) { p1Participants.add(toID(m[1])); break; }
				}
				for (let i = p2SwitchIdx; i < log.length; i++) {
					const m = /^\|(?:switch|drag)\|p1[a-z]: [^|]+\|([^|,]+)/.exec(log[i]);
					if (m) p1Participants.add(toID(m[1]));
				}
				const participantsStr = Array.from(p1Participants).join(',');
				battleRoom.add(`|-message|EXP_GAIN|${wildPoke.species}|${wildPoke.level}|${participantsStr}`);
				battleRoom.update();

				battleRoom.battle.forfeit(match.botUserId);
			} else {
				battleRoom.add(`|c|~|The Pokemon broke free! (Shakes: ${shakes})`);
				void battleRoom.battle.stream.write('>p1 pass');
			}
		},

		confirmreset(target, room, user) {
			const player = Database.load(user.id);
			if (!player) return this.errorReply("You haven't started your Kanto adventure yet!");
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'confirmreset')}`);
		},

		reset(target, room, user) {
			let player = Database.load(user.id);
			if (!player) return this.errorReply("You haven't started your Kanto adventure yet!");

			player = Database.create(user.id);
			player.introState = 1;
			Database.save(user.id, player);

			player.lastMessage = `Your Kanto adventure has been completely reset.`; Database.save(user.id, player);
			this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'intro')}`);
			if (player.lastMessage) scheduleDismiss(user, room, 'intro', undefined);
		},

		continue(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			if (player.pendingEvolutions && player.pendingEvolutions.length > 0) {
				const ev = player.pendingEvolutions[0];
				this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'evolution', ev)}`);
				if (player.lastMessage) scheduleDismiss(user, room, 'evolution', ev);
			} else if (player.pendingMoves && player.pendingMoves.length > 0) {
				const pm = player.pendingMoves[0];
				this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'learnmove', pm)}`);
				if (player.lastMessage) scheduleDismiss(user, room, 'learnmove', pm);
			} else {
				this.parse('/sg home');
			}
		},

		evolve(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			if (!player.pendingEvolutions || player.pendingEvolutions.length === 0) {
				return this.parse('/sg continue');
			}

			const ev = player.pendingEvolutions.shift();
			const p = player.party[ev!.partyIndex];
			const action = toID(target);

			if (action === 'confirm') {
				const oldName = Dex.species.get(p.species).name.toUpperCase();
				p.species = ev!.evoSpecies;

				const newDex = Dex.species.get(p.species);
				const baseHp = newDex.baseStats.hp;
				const newMaxHp = Math.floor((2 * baseHp * p.level) / 100) + p.level + 10;
				const hpDiff = newMaxHp - p.maxHp;
				p.maxHp = newMaxHp;
				if (p.hp > 0) p.hp += hpDiff;

				if (!player.pokedex) player.pokedex = { seen: [], caught: [] };
				if (!player.pokedex.caught.includes(p.species)) player.pokedex.caught.push(p.species);
				if (!player.pokedex.seen.includes(p.species)) player.pokedex.seen.push(p.species);

				const evoMoves = getMovesLearnedBetween(p.species, p.level, p.level, true);
				for (const move of evoMoves) {
					if (!p.moves.includes(move)) {
						if (p.moves.length < 4) {
							p.moves.push(move);
						} else {
							if (!player.pendingMoves) player.pendingMoves = [];
							player.pendingMoves.push({ partyIndex: ev!.partyIndex, move });
						}
					}
				}

				Database.save(user.id, player);
				this.sendReply(`|uhtmlchange|sggame|${SGRenderer.renderUI(player, 'evolved', { oldName, newName: newDex.name.toUpperCase(), species: p.species })}`);
			} else {
				Database.save(user.id, player);
				this.parse('/sg continue');
			}
		},

		learnmove(target, room, user) {
			const player = Database.load(user.id);
			if (!player || player.introState < 3) return this.errorReply("You haven't started your Kanto adventure yet!");

			if (!player.pendingMoves || player.pendingMoves.length === 0) {
				return this.parse('/sg continue');
			}

			const pm = player.pendingMoves[0];
			const p = player.party[pm.partyIndex];
			const actionParts = target.split(',').map(s => s.trim());
			const action = toID(actionParts[0]);

			if (action === 'cancel') {
				player.pendingMoves.shift();
				Database.save(user.id, player);
				return this.parse('/sg continue');
			} else if (action === 'replace') {
				const slot = parseInt(actionParts[1]);
				if (!isNaN(slot) && slot >= 0 && slot < p.moves.length) {
					const oldMove = p.moves[slot];
					p.moves[slot] = pm.move;
					player.pendingMoves.shift();
					Database.save(user.id, player);
					player.lastMessage = `${Dex.species.get(p.species).name.toUpperCase()} forgot ${Dex.moves.get(oldMove).name} and learned ${Dex.moves.get(pm.move).name}!`; Database.save(user.id, player);
					return this.parse('/sg continue');
				}
			}
			return this.parse('/sg continue');
		},
	},

	sgdev: {
		givemoney: 'addmoney',
		addmoney(target, room, user) {
			const [targetUser, amountStr] = target.split(',').map(s => s.trim());
			if (!targetUser || !amountStr) return this.errorReply("Usage: /sgdev addmoney [user], [amount]");

			const targetId = toID(targetUser);
			const player = Database.load(targetId);
			if (!player) return this.errorReply(`No save found for user ${targetUser}.`);

			const amount = parseInt(amountStr) || 0;
			player.money = Math.max(0, (player.money || 0) + amount);
			Database.save(targetId, player);

			this.sendReply(`Updated ${targetUser}'s balance to $${player.money}.`);
		},
		giveitembag: 'additem',
		additem(target, room, user) {
			const [targetUser, itemId, amountStr] = target.split(',').map(s => s.trim());
			if (!targetUser || !itemId) return this.errorReply("Usage: /sgdev additem [user], [item], [amount]");

			const targetId = toID(targetUser);
			const player = Database.load(targetId);
			if (!player) return this.errorReply(`No save found for user ${targetUser}.`);

			const itemData = SGItems[itemId];
			if (!itemData) return this.errorReply(`Item '${itemId}' not found in SGItems.`);

			let amount = parseInt(amountStr) || 1;
			if (amount < 1) amount = 1;

			if (!player.bag) player.bag = {};
			if (!player.bag[itemId]) player.bag[itemId] = 0;

			player.bag[itemId] += amount;
			Database.save(targetId, player);

			this.sendReply(`Added ${amount} ${(Dex.items.get(itemId).exists ? Dex.items.get(itemId).name : itemData.name)} to ${targetUser}'s bag.`);
		},
		givebadge(target, room, user) {
			const [targetUser, badge] = target.split(',').map(s => s.trim());
			if (!targetUser || !badge) return this.errorReply("Usage: /sgdev givebadge [user], [badge]");

			const targetId = toID(targetUser);
			const player = Database.load(targetId);
			if (!player) return this.errorReply(`No save found for user ${targetUser}.`);

			const bId = toID(badge);
			if (!player.badges.includes(bId)) {
				player.badges.push(bId);
				Database.save(targetId, player);
			}
			this.sendReply(`Awarded ${bId} badge to ${targetUser}. Total badges: ${player.badges.length}`);
		},
		givemon: 'addmon',
		addmon(target, room, user) {
			const [targetUser, pokemonId, levelStr] = target.split(',').map(s => s.trim());
			if (!targetUser || !pokemonId) return this.errorReply("Usage: /sgdev addmon [user], [pokemon], [level]");

			const targetId = toID(targetUser);
			const player = Database.load(targetId);
			if (!player) return this.errorReply(`No save found for user ${targetUser}.`);

			const species = Dex.species.get(pokemonId);
			if (!species.exists) return this.errorReply(`Pokemon '${pokemonId}' not found.`);

			const level = parseInt(levelStr) || 5;
			if (level < 1 || level > 100) return this.errorReply("Level must be between 1 and 100.");

			const moves = getMovesLearnedBetween(species.id, 0, level).slice(-4);
			const newMon = SGUtils.generateWild(species.id, level);
			newMon.moves = moves.length ? moves : ['tackle'];

			if (player.party.length < 6) {
				player.party.push(newMon);
				this.sendReply(`Added ${species.name} Lv${level} to ${targetUser}'s party.`);
			} else {
				if (!player.pc) player.pc = [];
				player.pc.push(newMon);
				this.sendReply(`Added ${species.name} Lv${level} to ${targetUser}'s PC.`);
			}

			if (!player.pokedex) player.pokedex = { seen: [], caught: [] };
			if (!player.pokedex.caught.includes(species.id)) player.pokedex.caught.push(species.id);
			if (!player.pokedex.seen.includes(species.id)) player.pokedex.seen.push(species.id);

			Database.save(targetId, player);
		},
	},
};

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const match = UtilityBattleResolver.activeMatches.get(battle.roomid);
		if (!match) return;

		UtilityBattleResolver.activeMatches.delete(battle.roomid);
		const botUser = Users.get(match.botUserId);
		if (botUser && !match.matchContext?.isPvP) UtilityBattleResolver.destroyBotUser(botUser);

		const player = Database.load(match.userId);
		if (!player) return;

		const room = Rooms.get(battle.roomid);
		const logLines: string[] = room?.log?.log ?? [];

		const state = UtilityBattleResolver.parseBattleState(logLines, player.party);

		for (let i = 0; i < player.party.length; i++) {
			const hpPct = state.p1TeamHp[i];
			const status = state.p1TeamStatus[i];
			if (hpPct !== undefined) {
				if (state.p1FaintedIndices.has(i) || hpPct <= 0) {
					player.party[i].hp = 0;
				} else {
					player.party[i].hp = Math.max(1, Math.round(player.party[i].maxHp * (hpPct / 100)));
				}
			}
			if (status !== undefined) player.party[i].status = status;
		}

		// Parse EXP_GAIN messages from the EXP Gain Mod
		const battleReport: string[] = [];
		const leveledUpIndices = new Set<number>();
		const expMessages = logLines.filter(l => l.startsWith('|-message|EXP_GAIN|'));
		const pendingMoves = [];

		for (const expMsg of expMessages) {
			const parts = expMsg.split('|');
			const defeatedSpecies = parts[3];
			const defeatedLevel = parseInt(parts[4]) || 1;
			const participants = parts[5] ? parts[5].split(',') : [];

			const expGained = Math.floor((Dex.species.get(defeatedSpecies).baseStats.hp * defeatedLevel) / 5);

			for (let i = 0; i < player.party.length; i++) {
				const p = player.party[i];
				if (p.hp > 0) {
					const isParticipant = participants.includes(p.species);
					const hasExpAll = player.bag?.['expall'];
					if (isParticipant || hasExpAll) {
						const actualExp = isParticipant ? expGained : Math.floor(expGained / 2);
						if (actualExp > 0) {
							const oldLevel = p.level;
							const pendingMovesOut: string[] = [];
							const msgs = SGUtils.giveExp(p, actualExp, player.badges.length, pendingMovesOut);

							for (const move of pendingMovesOut) pendingMoves.push({ partyIndex: i, move });

							if (p.level > oldLevel) leveledUpIndices.add(i);
							if (!isParticipant && msgs.length > 0) {
								msgs[0] += ' (Exp. All)';
							}
							battleReport.push(...msgs);
						}
					}
				}
			}
		}

		if (pendingMoves.length > 0) {
			player.pendingMoves = pendingMoves;
		}

		const pendingEvolutions = [];
		for (const idx of Array.from(leveledUpIndices)) {
			const p = player.party[idx];
			if (p.item === 'eviolite' || p.item === 'everstone') continue;
			const evo = getLevelUpEvo(p.species);
			if (evo && p.level >= evo.evoLevel) {
				pendingEvolutions.push({ partyIndex: idx, evoSpecies: evo.evoTo });
			}
		}
		if (pendingEvolutions.length > 0) {
			player.pendingEvolutions = pendingEvolutions;
		}

		Database.save(player.userid, player);
		if (room) room.update();

		const matchType = match.matchContext?.type;

		if (matchType === 'wild') {
			const enemyPoke = match.matchContext.wildPoke;
			const playerWon = match.matchContext.caught || (winner && toID(winner) === match.userId);

			if (playerWon) {
				if (!player.stats) player.stats = { wildBattlesWon: 0, trainersBeaten: 0, pvpWins: 0, pvpLosses: 0 };
				player.stats.wildBattlesWon++;

				const defeatedLevel = enemyPoke ? enemyPoke.level : 5;
				const moneyEarned = Math.max(50, defeatedLevel * 40);
				player.money = (player.money || 0) + moneyEarned;
				battleReport.push(`Earned <strong style="color:#2e6b27;">$${moneyEarned}</strong>!`);
			} else {
				const penalty = Math.min(player.money || 0, Math.max(50, Math.floor((player.money || 0) * 0.1)));
				player.money = Math.max(0, (player.money || 0) - penalty);
			}
			Database.save(player.userid, player);

			match.matchContext.battleReport = battleReport;
			const uobj = Users.get(match.userId);
			if (uobj) {
				let screen = 'defeat';
				if (match.matchContext.caught) {
					screen = 'caught';
				} else if (playerWon) {
					screen = 'victory';
				}

				const ui = SGRenderer.renderUI(player, screen, match.matchContext);
				const sRoom = Rooms.get(match.matchContext.sourceRoomId);
				if (sRoom) uobj.sendTo(sRoom, `|uhtmlchange|sggame|${ui}`);
				else uobj.send(`|uhtmlchange|sggame|${ui}`);
			}
		} else if (matchType === 'trainer') {
			const trainer = match.matchContext.trainer;
			const playerWon = (winner && toID(winner) === match.userId);

			if (playerWon) {
				if (!player.stats) player.stats = { wildBattlesWon: 0, trainersBeaten: 0, pvpWins: 0, pvpLosses: 0 };
				player.stats.trainersBeaten++;

				if (!player.defeatedTrainers) player.defeatedTrainers = [];
				if (!player.defeatedTrainers.includes(trainer.id)) {
					player.defeatedTrainers.push(trainer.id);
				}

				player.money = (player.money || 0) + trainer.rewardMoney;
				battleReport.push(`Defeated ${trainer.title} ${trainer.name}! Won <strong style="color:#2e6b27;">$${trainer.rewardMoney}</strong>!`);

				// Gym Leader badge & TM rewards
				if (trainer.isGymLeader && trainer.rewardBadge) {
					if (!player.badges.includes(trainer.rewardBadge)) {
						player.badges.push(trainer.rewardBadge);
						battleReport.push(`Awarded the official <strong style="color:#f57f17;">${trainer.rewardBadge.toUpperCase()} BADGE</strong>!`);
						battleReport.push(`Soft level cap raised to <strong style="color:#2e7d32;">Lv${getLevelCap(player.badges.length)}</strong>!`);

						// Unlock Key Items per badge milestones
						if (trainer.rewardBadge === 'boulder') {
							player.bag['tree_shears'] = 1;
							battleReport.push(`Received <strong style="color:#1565c0;">Tree Shears</strong>! Small trees can now be trimmed!`);
						} else if (trainer.rewardBadge === 'cascade') {
							player.bag['bicycle'] = 1;
							battleReport.push(`Received <strong style="color:#1565c0;">Bicycle</strong>! Travel speed increased!`);
						} else if (trainer.rewardBadge === 'thunder') {
							player.bag['fly_pass'] = 1;
							battleReport.push(`Received <strong style="color:#1565c0;">Fly Network Pass</strong>! You can now fast travel to previously discovered towns!`);
						} else if (trainer.rewardBadge === 'soul') {
							player.bag['surfboard'] = 1;
							battleReport.push(`Received <strong style="color:#1565c0;">Surfboard</strong>! Waterways can now be traversed!`);
						}

						if (trainer.rewardItem) {
							player.bag[trainer.rewardItem] = 1;
							const itemName = SGItems[trainer.rewardItem]?.name || trainer.rewardItem;
							battleReport.push(`Received <strong style="color:#7b1fa2;">${itemName}</strong>!`);
						}
					}
				}
			} else {
				const penalty = Math.min(player.money || 0, Math.max(50, Math.floor((player.money || 0) * 0.1)));
				player.money = Math.max(0, (player.money || 0) - penalty);
			}

			Database.save(player.userid, player);

			match.matchContext.battleReport = battleReport;
			const uobj = Users.get(match.userId);
			if (uobj) {
				const screen = playerWon ? 'trainer_victory' : 'defeat';
				const ui = SGRenderer.renderUI(player, screen, match.matchContext);
				const sRoom = Rooms.get(match.matchContext.sourceRoomId);
				if (sRoom) uobj.sendTo(sRoom, `|uhtmlchange|sggame|${ui}`);
				else uobj.send(`|uhtmlchange|sggame|${ui}`);
			}
		} else if (matchType === 'pvp') {
			const p1User = match.matchContext.p1User;
			const p2User = match.matchContext.p2User;

			const p1Player = Database.load(p1User);
			const p2Player = Database.load(p2User);

			if (p1Player && p2Player) {
				if (!p1Player.stats) p1Player.stats = { wildBattlesWon: 0, trainersBeaten: 0, pvpWins: 0, pvpLosses: 0 };
				if (!p2Player.stats) p2Player.stats = { wildBattlesWon: 0, trainersBeaten: 0, pvpWins: 0, pvpLosses: 0 };

				if (winner && toID(winner) === p1User) {
					p1Player.stats.pvpWins++;
					p2Player.stats.pvpLosses++;
				} else if (winner && toID(winner) === p2User) {
					p2Player.stats.pvpWins++;
					p1Player.stats.pvpLosses++;
				}

				Database.save(p1User, p1Player);
				Database.save(p2User, p2Player);
			}
		}
	},
};
