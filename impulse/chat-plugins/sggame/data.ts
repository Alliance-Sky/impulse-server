export interface StarterGen {
	gen: number;
	region: string;
	starters: string[];
}

export const STARTER_GENS: Record<number, StarterGen> = {
	1: { gen: 1, region: 'Kanto', starters: ['bulbasaur', 'charmander', 'squirtle', 'pikachu'] },
	2: { gen: 2, region: 'Johto', starters: ['chikorita', 'cyndaquil', 'totodile'] },
	3: { gen: 3, region: 'Hoenn', starters: ['treecko', 'torchic', 'mudkip'] },
	4: { gen: 4, region: 'Sinnoh', starters: ['turtwig', 'chimchar', 'piplup'] },
	5: { gen: 5, region: 'Unova', starters: ['snivy', 'tepig', 'oshawott'] },
	6: { gen: 6, region: 'Kalos', starters: ['chespin', 'fennekin', 'froakie'] },
	7: { gen: 7, region: 'Alola', starters: ['rowlet', 'litten', 'popplio'] },
	8: { gen: 8, region: 'Galar', starters: ['grookey', 'scorbunny', 'sobble'] },
	9: { gen: 9, region: 'Paldea', starters: ['sprigatito', 'fuecoco', 'quaxly'] },
};

export const ALL_STARTERS: string[] = Object.values(STARTER_GENS).flatMap(g => g.starters);

export * from './locations';
