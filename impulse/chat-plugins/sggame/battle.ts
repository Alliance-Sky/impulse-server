import { type SGPlayer, type SGPokemon, type SGTrainer } from './types';
import { Database } from './database';
import { UtilityBattleResolver } from '../../utils/battle';
import { packTeam, packAITeam, type PackablePokemon, type PackableAISet } from '../../utils/packers';
import { getAllLevelUpMoves } from '../../utils/moves';

export const SGBattle = {
	renderCatchUI(p: SGPlayer): string {
		let catchHTML = `<div style="text-align: center; margin-top: 5px;">`;
		const balls = [
			{ id: 'pokeball', name: 'Poké Ball', img: 'https://i.ibb.co/LdXWzyFm/pokeball.png' },
			{ id: 'greatball', name: 'Great Ball', img: 'https://i.ibb.co/mVjYKGpP/greatball.png' },
			{ id: 'ultraball', name: 'Ultra Ball', img: 'https://i.ibb.co/n8YrGSZq/ultraball.png' },
			{ id: 'masterball', name: 'Master Ball', img: 'https://i.ibb.co/C36ByMDw/masterball.png' },
		];
		for (const ball of balls) {
			const count = p.bag[ball.id] || 0;
			const disabled = count > 0 ? '' : 'disabled';
			const opacity = count > 0 ? '1' : '0.4';
			const cursor = count > 0 ? 'pointer' : 'not-allowed';

			catchHTML += `<button name="send" value="/sg catch ${ball.id}" style="background: transparent; border: 1px solid #aaa; border-radius: 4px; cursor: ${cursor}; opacity: ${opacity}; margin: 0 4px; padding: 4px; vertical-align: middle;" ${disabled}>`;
			catchHTML += `<img src="${ball.img}" alt="${ball.name}" style="width: 32px; height: 32px; display: block;" />`;
			catchHTML += `</button>`;
		}
		catchHTML += `</div>`;
		return catchHTML;
	},

	buildPlayerTeam(player: SGPlayer): PackablePokemon[] {
		return player.party.map(p => ({
			species: p.species,
			level: p.level,
			currentHp: Math.ceil((p.hp / p.maxHp) * 100),
			moves: p.moves,
			status: p.status,
			heldItem: p.item || '',
			nature: 'Hardy',
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
			gender: p.gender || 'M',
			shiny: p.shiny || false,
		}));
	},

	startWildEncounter(user: User, player: SGPlayer, wildPoke: SGPokemon, sourceRoomId: string) {
		const resolver = new UtilityBattleResolver(user);
		const packedPlayerTeam = packTeam(this.buildPlayerTeam(player));

		const botSet: PackableAISet = {
			species: wildPoke.species,
			name: Dex.species.get(wildPoke.species).name,
			level: wildPoke.level,
			ability: Dex.species.get(wildPoke.species).abilities[0] || '',
			nature: 'Hardy',
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
			evs: { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
			item: '',
			shiny: wildPoke.shiny || false,
			teraType: '',
			moves: wildPoke.moves,
			gender: wildPoke.gender || 'M',
		};
		const packedBotTeam = packAITeam([botSet]);

		const roomTitle = `Wild ${Dex.species.get(wildPoke.species).name}`;

		const room = resolver.start(
			{
				packedTeam: packedBotTeam,
				isTrainer: false,
				trainerName: 'Wild Encounter',
				team: [botSet],
			},
			'gen9sggamesingles',
			roomTitle,
			packedPlayerTeam,
			{ maxDepth: 1 },
			9,
			(battleRoom: any, turn: number) => {
				const curPlayer = Database.load(user.id);
				if (curPlayer) {
					if (battleRoom.lastCatchTurn) {
						battleRoom.add(`|uhtmlchange|catchmenu-${battleRoom.lastCatchTurn}|`);
					}
					battleRoom.add(`|uhtml|catchmenu-${turn}|${this.renderCatchUI(curPlayer)}`);
					battleRoom.update();
					battleRoom.lastCatchTurn = turn;
				}
			},
			{ type: 'wild', wildPoke, sourceRoomId }
		);

		if (room) {
			room.lastCatchTurn = 1;
			room.add(`|uhtml|catchmenu-1|${this.renderCatchUI(player)}`);
			room.update();
		}
	},

	startTrainerBattle(user: User, player: SGPlayer, trainer: SGTrainer, sourceRoomId: string) {
		const resolver = new UtilityBattleResolver(user);
		const packedPlayerTeam = packTeam(this.buildPlayerTeam(player));

		const botSets: PackableAISet[] = trainer.team.map(mon => {
			const dexSp = Dex.species.get(mon.species);
			let moves = mon.moves;
			if (!moves || !moves.length) {
				moves = getAllLevelUpMoves(dexSp.id, mon.level, 9).slice(-4);
			}
			if (!moves.length) moves = ['tackle'];

			return {
				species: dexSp.id,
				name: dexSp.name,
				level: mon.level,
				ability: mon.ability || dexSp.abilities[0] || '',
				nature: 'Hardy',
				ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
				evs: { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
				item: mon.item || '',
				shiny: mon.shiny || false,
				teraType: '',
				moves,
				gender: 'M',
			};
		});

		const packedBotTeam = packAITeam(botSets);
		const trainerTitleName = `${trainer.title} ${trainer.name}`;
		const roomTitle = `${trainerTitleName} Battle`;

		const depth = (trainer.isGymLeader || trainer.isEliteFour) ? 2 : 1;

		const room = resolver.start(
			{
				packedTeam: packedBotTeam,
				isTrainer: true,
				trainerName: trainerTitleName,
				team: botSets,
			},
			'gen9sggamesingles',
			roomTitle,
			packedPlayerTeam,
			{ maxDepth: depth },
			9,
			undefined, // No catch UI in trainer battles!
			{ type: 'trainer', trainer, sourceRoomId }
		);

		if (room) {
			room.add(`|c|~|${trainerTitleName}: ${trainer.quote}`);
			room.update();
		}
	},

	startPvPBattle(user1: User, user2: User, p1: SGPlayer, p2: SGPlayer, sourceRoomId: string) {
		const packed1 = packTeam(this.buildPlayerTeam(p1));
		const packed2 = packTeam(this.buildPlayerTeam(p2));

		const room = Rooms.createBattle({
			format: 'gen9sggamesingles',
			rated: false,
			title: `PvP: ${user1.name} vs ${user2.name}`,
			players: [
				{ user: user1, team: packed1 },
				{ user: user2, team: packed2 },
			],
		});

		if (room) {
			UtilityBattleResolver.activeMatches.set(room.roomid, {
				userId: user1.id as ID,
				botUserId: user2.id as ID,
				isTrainerBattle: true,
				matchContext: { type: 'pvp', p1User: user1.id, p2User: user2.id, sourceRoomId },
			});
		}
		return room;
	},
};
