import { type SGPokemon } from './types';
import { expForLevel, getExpType, applyExpAndLevelUp } from '../../utils/exp';
import { getMovesLearnedBetween, getAllLevelUpMoves } from '../../utils/moves';

export const BADGE_LEVEL_CAPS: Record<number, number> = {
	0: 14, // Brock cap
	1: 21, // Misty cap
	2: 24, // Lt. Surge cap
	3: 29, // Erika cap
	4: 43, // Koga cap
	5: 43, // Sabrina cap
	6: 47, // Blaine cap
	7: 50, // Giovanni cap
	8: 65, // Champion cap
};

export function getLevelCap(badgeCount: number): number {
	if (badgeCount >= 9) return 100;
	if (badgeCount >= 8) return 65;
	return BADGE_LEVEL_CAPS[badgeCount] ?? 14;
}

export const SGUtils = {
	generateWild(species: string, level: number): SGPokemon {
		const dexSp = Dex.species.get(species);

		const baseHp = dexSp.baseStats.hp;
		const maxHp = Math.floor((2 * baseHp * level) / 100) + level + 10;

		let moves = getMovesLearnedBetween(dexSp.id, 0, level, false, 9).slice(-4);
		if (!moves.length) {
			// Fallback: check all level up moves
			moves = getAllLevelUpMoves(dexSp.id, level, 9).slice(-4);
		}
		if (!moves.length) moves = ['tackle'];

		let gender: 'M' | 'F' | 'N' = 'N';
		if (dexSp.gender) {
			gender = dexSp.gender;
		} else if (dexSp.genderRatio) {
			gender = Math.random() < dexSp.genderRatio.M ? 'M' : 'F';
		}

		// 1% chance of shiny
		const shiny = Math.random() < 0.01;

		return {
			species: dexSp.id,
			level,
			exp: expForLevel(level, getExpType(dexSp.id)),
			hp: maxHp,
			maxHp,
			status: '',
			moves,
			gender,
			shiny,
		};
	},

	heal(pokemon: SGPokemon) {
		pokemon.hp = pokemon.maxHp;
		pokemon.status = '';
	},

	giveExp(pokemon: SGPokemon, expGained: number, badgeCount = 0, pendingMovesOut?: string[]): string[] {
		const messages: string[] = [];
		const dexSp = Dex.species.get(pokemon.species);
		const expType = getExpType(dexSp.id);
		const cap = getLevelCap(badgeCount);

		let actualExp = expGained;
		let hitCap = false;

		if (pokemon.level >= cap) {
			actualExp = 1; // Soft cap: minimal progress when capped
			hitCap = true;
		}

		messages.push(`${dexSp.name} gained ${actualExp} EXP!`);
		if (hitCap) {
			messages.push(`(Soft capped at Lv${cap}! Win more Gym Badges to raise your level cap.)`);
		}

		const { leveledUp, newLevel, newExp } = applyExpAndLevelUp(pokemon.level, pokemon.exp, actualExp, expType, cap);

		pokemon.exp = newExp;
		if (leveledUp) {
			messages.push(`${dexSp.name} grew to level ${newLevel}!`);

			const newMoves = getMovesLearnedBetween(dexSp.id, pokemon.level, newLevel);
			pokemon.level = newLevel;

			const baseHp = dexSp.baseStats.hp;
			const newMaxHp = Math.floor((2 * baseHp * newLevel) / 100) + newLevel + 10;
			const diff = newMaxHp - pokemon.maxHp;
			pokemon.maxHp = newMaxHp;
			if (pokemon.hp > 0) pokemon.hp += diff;

			for (const move of newMoves) {
				if (!pokemon.moves.includes(move)) {
					if (pokemon.moves.length < 4) {
						pokemon.moves.push(move);
						messages.push(`${dexSp.name} learned ${Dex.moves.get(move).name}!`);
					} else {
						if (pendingMovesOut) {
							pendingMovesOut.push(move);
						} else {
							const oldMove = pokemon.moves.shift();
							pokemon.moves.push(move);
							messages.push(`${dexSp.name} forgot ${Dex.moves.get(oldMove).name} and learned ${Dex.moves.get(move).name}!`);
						}
					}
				}
			}
		}

		return messages;
	},
};
