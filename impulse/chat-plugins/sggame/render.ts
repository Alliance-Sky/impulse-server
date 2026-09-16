import { expForLevel, getExpType } from "../../utils/exp";
import { type SGPlayer } from './types';
import { SGItems } from './items';
import { STARTER_GENS } from './data';
import { SG_LOCATIONS } from './locations';

export const SGRenderer = {
	renderUI(player: SGPlayer, screen = 'home', context?: any): string {
		const gbLight = '#f8f8f8';
		const gbDark = '#333333';

		// The Shell (GBA style)
		let html = `<div style="width: 100%; height: 420px; background: linear-gradient(180deg, #7B68AE 0%, #6D5CA8 100%); padding: 8px 8px 3px 8px; border-radius: 8px 8px 20px 20px; box-sizing: border-box; font-family: 'Arial', sans-serif; box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.3);">`;

		const msg = player.lastMessage || context?.message || '';
		const contentHeight = msg ? 322 : 344;
		const navBottom = msg ? 30 : 8;
		const makeNav = (val: string, text: string) => `<div style="position: absolute; bottom: ${navBottom}px; right: 10px; z-index: 10;"><button name="send" value="${val}" style="background: none; border: none; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; text-decoration: underline;">${text}</button></div>`;

		// Screen bezel
		html += `<div style="border: 3px solid #1a1a2e; border-radius: 3px; background: ${gbLight}; color: ${gbDark}; position: relative; box-sizing: border-box; overflow: hidden; height: 350px;">`;
		// Scrolling content
		html += `<div style="padding: 10px 10px 40px 10px; height: ${contentHeight}px; box-sizing: border-box; overflow-y: auto;">`;

		if (screen === 'intro') {
			html += `<div style="text-align: center; margin-top: 0px;"><img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" alt="Professor Oak" style="image-rendering: pixelated; width: 75px;" /></div>`;
			html += `<div style="font-family: monospace, sans-serif; font-size: 11px; line-height: 1.4; background: rgba(255, 255, 255, 0.7); border: 2px solid #333; border-radius: 5px; padding: 6px 8px; margin-top: 5px; box-shadow: 2px 2px 0px rgba(0,0,0,0.15);">`;
			html += `<strong style="font-size: 12.5px;">Welcome to the world of SGgame!</strong><br/><br/>I'm Prince Sky. This project faithfully recreates the original SpacialGaze RPG adventure, now fully expanded with <strong>all 9 Generations</strong> of Pokémon, regional routes, starters, and modern evolution mechanics!<br/><br/>Choose your starter, train your team, and become the Champion!`;
			html += `</div>`;
			html += `${makeNav("/sg pickstarter 1", "NEXT ▶")}`;
		} else if (screen === 'pick_starter') {
			const curGen = Math.min(9, Math.max(1, parseInt(context?.gen) || 1));
			const genData = STARTER_GENS[curGen] || STARTER_GENS[1];
			const prevGen = curGen > 1 ? curGen - 1 : 9;
			const nextGen = curGen < 9 ? curGen + 1 : 1;

			html += `<div style="text-align: center; margin-bottom: 6px;"><strong style="font-size: 12px;">CHOOSE YOUR STARTER POKÉMON</strong></div>`;

			// Gen navigator header
			html += `<div style="text-align: center; margin-bottom: 8px;">`;
			html += `<button name="send" value="/sg pickstarter ${prevGen}" style="background: none; border: 1px solid ${gbDark}; padding: 2px 8px; cursor: pointer; color: inherit; font-size: 11px; font-weight: bold; border-radius: 3px;">◀</button> `;
			html += `<span style="font-weight: bold; font-size: 11px; margin: 0 6px; display: inline-block; min-width: 150px;">GEN ${curGen} (${genData.region.toUpperCase()})</span> `;
			html += `<button name="send" value="/sg pickstarter ${nextGen}" style="background: none; border: 1px solid ${gbDark}; padding: 2px 8px; cursor: pointer; color: inherit; font-size: 11px; font-weight: bold; border-radius: 3px;">▶</button>`;
			html += `</div>`;

			// Starter cards
			html += `<div style="text-align: center; margin-top: 15px;">`;
			for (const mon of genData.starters) {
				const sp = Dex.species.get(mon);
				html += `<button name="send" value="/sg starter ${mon}" style="display: inline-block; vertical-align: top; width: 88px; margin: 6px; background: #ffffff; border: 2px solid ${gbDark}; padding: 12px 4px 10px 4px; color: ${gbDark}; cursor: pointer; color: inherit; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">`;
				html += `<div style="height: 38px; line-height: 38px;"><psicon pokemon="${mon}" style="transform: scale(1.25); display: inline-block;" /></div>`;
				html += `<div style="font-weight: bold; font-size: 11px; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sp.name}</div>`;
				html += `<div style="font-size: 9.5px; color: #666; margin-top: 2px;">${sp.types.join('/')}</div>`;
				html += `<div style="margin-top: 8px; background: ${gbDark}; color: #fff; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 3px; display: inline-block;">CHOOSE</div>`;
				html += `</button>`;
			}
			html += `</div>`;
		} else if (screen === 'home') {
			html += `<div><strong>TRAINER ${player.userid.toUpperCase()}</strong></div>`;
			html += `<div style="font-size: 11px; margin-top: 2px;"><b>Location:</b> ${player.location}</div>`;
			html += `<div style="font-size: 11px; margin-bottom: 5px; color: #2e6b27;"><b>Money:</b> $${player.money ?? 1000}</div><hr style="border-color: ${gbDark}; margin: 4px 0 6px 0;"/>`;
			html += `<button name="send" value="/sg wild" style="padding: 4px; width: 100%; margin-bottom: 4px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">SEARCH WILD POKÉMON</button>`;
			html += `<button name="send" value="/sg party" style="padding: 4px; width: 100%; margin-bottom: 4px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">PARTY</button>`;
			html += `<button name="send" value="/sg bag" style="padding: 4px; width: 100%; margin-bottom: 4px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">BAG</button>`;
			html += `<button name="send" value="/sg mart" style="padding: 4px; width: 100%; margin-bottom: 4px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">POKÉ MART</button>`;
			html += `<button name="send" value="/sg travel" style="padding: 4px; width: 100%; margin-bottom: 4px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">MAP / TRAVEL</button>`;
			html += `<button name="send" value="/sg heal" style="padding: 4px; width: 100%; margin-bottom: 4px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">POKÉMON CENTER</button>`;
			html += `<button name="send" value="/sg pc" style="padding: 4px; width: 100%; margin-bottom: 8px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">ACCESS PC</button>`;
			html += `<button name="send" value="/sg confirmreset" style="padding: 4px; width: 100%; background: none; border: 1px solid darkred; color: darkred; font-weight: bold; cursor: pointer; color: inherit; font-size: 11px;">RESET RUN</button>`;
		} else if (screen === 'travel') {
			html += `<div style="text-align: center; font-weight: bold; font-size: 12px; margin-bottom: 3px;">WORLD MAP & TRAVEL</div>`;
			html += `<div style="text-align: center; font-size: 10px; color: #555; margin-bottom: 5px;">Current: <b>${player.location}</b></div><hr style="border-color: ${gbDark}; margin: 4px 0 6px 0;"/>`;

			for (const loc of Object.values(SG_LOCATIONS)) {
				const isCurrent = (player.location === loc.name);
				const bg = isCurrent ? 'rgba(0,128,0,0.1)' : 'rgba(255,255,255,0.4)';
				const border = isCurrent ? '2px solid green' : `1px solid ${gbDark}`;

				html += `<div style="margin-bottom: 5px; background: ${bg}; border: ${border}; border-radius: 4px; padding: 4px 6px; overflow: hidden;">`;
				html += `<div style="float: left; width: 65%; line-height: 1.2;">`;
				html += `<strong style="font-size: 11px;">${loc.name}</strong><br/>`;
				html += `<span style="font-size: 9px; color: #666;">${loc.region} ${loc.gen ? `(Gen ${loc.gen})` : ''}</span><br/>`;
				html += `<div style="margin-top: 2px;">`;
				for (const p of loc.preview) {
					html += `<psicon pokemon="${p}" style="transform: scale(0.85); margin-right: -4px;" />`;
				}
				html += `</div>`;
				html += `</div>`;
				html += `<div style="float: right; width: 32%; text-align: right; margin-top: 8px;">`;
				if (isCurrent) {
					html += `<span style="font-size: 10px; font-weight: bold; color: green;">[HERE]</span>`;
				} else {
					html += `<button name="send" value="/sg travel ${loc.id}" style="background: none; border: 1px solid ${gbDark}; color: ${gbDark}; padding: 3px 8px; font-size: 10px; font-weight: bold; cursor: pointer; color: inherit; border-radius: 3px;">GO ▶</button>`;
				}
				html += `</div>`;
				html += `<div style="clear: both;"></div>`;
				html += `</div>`;
			}
			html += makeNav("/sg home", "BACK TO MENU ▶");
		} else if (screen === 'mart') {
			const martCats = ['Pokeballs', 'Medicine', 'Evolution', 'Held Items'];
			const currentCat = context?.category || 'Pokeballs';

			// Left pane: Categories (30%)
			html += `<div style="float: left; width: 30%; height: 100%; box-sizing: border-box; padding-right: 5px; border-right: 2px solid ${gbDark}; text-align: center;">`;
			html += `<div style="font-weight: bold; font-size: 11px;">POKÉ MART</div>`;
			html += `<div style="font-size: 9px; color: #2e6b27; margin: 3px 0;">$${player.money ?? 1000}</div><hr style="border-color: ${gbDark}; margin: 4px 0;"/>`;

			for (const cat of martCats) {
				const isSel = currentCat === cat;
				const bg = isSel ? 'rgba(0,0,0,0.15)' : 'none';
				html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg mart cat ${cat}" style="width: 100%; background: ${bg}; border: 1px solid ${gbDark}; cursor: pointer; color: inherit; padding: 4px 2px; font-size: 9.5px; border-radius: 3px;">${cat}</button></div>`;
			}
			html += `</div>`;

			// Right pane: Items for sale (70%)
			html += `<div style="float: right; width: 70%; height: 100%; box-sizing: border-box; padding-left: 5px; overflow-y: auto;">`;
			html += `<div style="font-weight: bold; font-size: 11px; text-align: center;">${currentCat.toUpperCase()}</div><hr style="border-color: ${gbDark}; margin: 5px 0;"/>`;

			let foundAny = false;
			for (const [id, itemData] of Object.entries(SGItems)) {
				if (itemData.category === currentCat && itemData.price) {
					foundAny = true;
					const owned = player.bag[id] || 0;
					const canAfford = (player.money || 0) >= itemData.price;
					const maxQty = (itemData.category === 'Held Items' || itemData.category === 'Key Items' || itemData.category === 'TMs') ? 1 : 99;
					const isMax = owned >= maxQty;

					html += `<div style="border: 1px solid #ccc; border-radius: 3px; padding: 4px; margin-bottom: 5px; background: rgba(255,255,255,0.5);">`;
					html += `<strong style="font-size: 11px;">${itemData.name}</strong> <span style="float: right; font-weight: bold; color: #2e6b27; font-size: 11px;">$${itemData.price}</span><br/>`;
					html += `<div style="font-size: 9.5px; color: #555; margin: 2px 0;">${itemData.description}</div>`;
					html += `<div style="overflow: hidden; margin-top: 3px;">`;
					html += `<span style="font-size: 9px; color: #777;">Owned: ${owned}</span>`;
					if (isMax) {
						html += `<button disabled style="float: right; background: #eee; border: 1px solid #ccc; color: #999; font-size: 9px; padding: 2px 6px; border-radius: 3px;">MAX</button>`;
					} else if (!canAfford) {
						html += `<button disabled style="float: right; background: #eee; border: 1px solid #ccc; color: #999; font-size: 9px; padding: 2px 6px; border-radius: 3px;">BUY</button>`;
					} else {
						html += `<button name="send" value="/sg mart buy ${id}" style="float: right; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-size: 9px; font-weight: bold; padding: 2px 8px; border-radius: 3px; cursor: pointer; color: inherit;">BUY</button>`;
					}
					html += `</div>`;
					html += `</div>`;
				}
			}

			if (!foundAny) {
				html += `<div style="text-align: center; color: #666; margin-top: 20px; font-size: 11px;">No items for sale in this category.</div>`;
			}
			html += `</div>`;
			html += `<div style="clear: both;"></div>`;
			html += makeNav("/sg home", "EXIT MART ▶");
		} else if (screen === 'pc') {
			const box = context?.box || 0;
			const pcSize = 30; // 30 pokemon per box
			const maxBoxes = Math.max(1, Math.ceil((player.pc?.length || 0) / pcSize) + 1); // always an empty box at the end
			const prevBox = box > 0 ? box - 1 : maxBoxes - 1;
			const nextBox = box < maxBoxes - 1 ? box + 1 : 0;

			// Left pane: Party / Summary (32%)
			html += `<div style="float: left; width: 32%; height: 100%; box-sizing: border-box; padding-right: 5px; border-right: 2px solid ${gbDark}; text-align: center;">`;
			html += `<b>PARTY</b><hr style="border-color: ${gbDark}; margin-top: 5px; margin-bottom: 5px;"/>`;

			const selected = context?.selected;
			let selMon = null;
			let isParty = false;
			if (selected) {
				isParty = selected.source === 'party';
				selMon = isParty ? player.party[selected.index] : player.pc[selected.index];
			}

			if (selected && selMon) {
				html += `<div><psicon pokemon="${selMon.species}" /></div>`;
				html += `<div style="font-size: 11px; font-weight: bold;">${Dex.species.get(selMon.species).name.toUpperCase()}${selMon.shiny ? ' ✨' : ''}</div>`;
				html += `<div style="font-size: 10px;">Lv${selMon.level}</div><br/>`;

				html += `<div>`;
				if (isParty) {
					html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg pc deposit ${selected.index}" style="background: none; border: 1px solid ${gbDark}; color: ${gbDark}; cursor: pointer; color: inherit; font-size: 10px; width: 100%; padding: 4px;">DEPOSIT</button></div>`;
				} else {
					html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg pc withdraw ${selected.index}" style="background: none; border: 1px solid ${gbDark}; color: ${gbDark}; cursor: pointer; color: inherit; font-size: 10px; width: 100%; padding: 4px;">WITHDRAW</button></div>`;
				}
				html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg pc release ${selected.source} ${selected.index}" style="background: none; border: 1px solid darkred; color: darkred; cursor: pointer; color: inherit; font-size: 10px; width: 100%; padding: 4px;">RELEASE</button></div>`;
				html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg pc" style="background: none; border: 1px solid ${gbDark}; color: ${gbDark}; cursor: pointer; color: inherit; font-size: 10px; width: 100%; padding: 4px;">BACK</button></div>`;
				html += `</div>`;
			} else {
				for (let i = 0; i < 6; i++) {
					const p = player.party[i];
					let btnStyle = `width: 100%; height: 40px; background: none; border: 1px solid #aaa; border-radius: 3px; cursor: pointer; color: inherit; margin-bottom: 2px;`;
					if (p) btnStyle = `width: 100%; height: 40px; background: none; border: 1px solid ${gbDark}; border-radius: 3px; cursor: pointer; color: inherit; text-align: center; margin-bottom: 2px;`;

					html += `<button name="send" value="/sg pc select party ${i}" style="${btnStyle}">${p ? `<psicon pokemon="${p.species}" />` : ''}</button><br/>`;
				}
			}
			html += `</div>`;

			// Right pane: PC Box (68%)
			html += `<div style="float: right; width: 68%; height: 100%; box-sizing: border-box; padding-left: 5px; text-align: center;">`;
			html += `<div><button name="send" value="/sg pc box ${prevBox}" style="background: none; border: none; cursor: pointer; color: inherit;">&#8592;</button> <b>BOX ${box + 1}</b> <button name="send" value="/sg pc box ${nextBox}" style="background: none; border: none; cursor: pointer; color: inherit;">&#8594;</button></div><hr style="border-color: ${gbDark}; margin-top: 5px; margin-bottom: 5px;"/>`;

			html += `<table style="width: 100%; height: 260px; table-layout: fixed; border-collapse: separate; border-spacing: 2px;">`;
			let slot = 0;
			for (let r = 0; r < 5; r++) {
				html += `<tr>`;
				for (let c = 0; c < 6; c++) {
					const pcIndex = box * pcSize + slot;
					const p = player.pc?.[pcIndex];
					let btnStyle = `width: 100%; height: 100%; min-height: 35px; background: none; border: 1px solid #aaa; border-radius: 3px; cursor: pointer; color: inherit;`;
					if (p) btnStyle = `width: 100%; height: 100%; min-height: 35px; background: none; border: 1px solid ${gbDark}; border-radius: 3px; cursor: pointer; color: inherit; text-align: center;`;

					html += `<td style="padding: 0;"><button name="send" value="/sg pc select pc ${pcIndex}" style="${btnStyle}">${p ? `<psicon pokemon="${p.species}" />` : ''}</button></td>`;
					slot++;
				}
				html += `</tr>`;
			}
			html += `</table>`;

			html += `</div>`;

			html += `<div style="clear: both;"></div>`;
			html += makeNav("/sg home", "EXIT PC ▶");
		} else if (screen === 'party') {
			// Left pane: Party List (48%)
			html += `<div style="float: left; width: 48%; height: 100%; box-sizing: border-box; padding-right: 5px; border-right: 2px solid ${gbDark};">`;
			html += `<div style="text-align: center; font-weight: bold;">PARTY</div><hr style="border-color: ${gbDark}; margin-top: 5px; margin-bottom: 5px;"/>`;

			const isMoving = context?.moving !== undefined;

			for (let i = 0; i < 6; i++) {
				const p = player.party[i];
				if (p) {
					const isSelected = context?.selected === i;
					const isMoveSrc = context?.moving === i;
					const bg = isSelected ? 'rgba(0,0,0,0.1)' : (isMoveSrc ? 'rgba(0,0,255,0.1)' : 'none');
					const cmd = isMoving ? `/sg party move ${context.moving} ${i}` : `/sg party select ${i}`;

					html += `<button name="send" value="${cmd}" style="width: 100%; background: ${bg}; border: 1px solid ${gbDark}; border-radius: 3px; cursor: pointer; color: inherit; text-align: left; margin-bottom: 2px; padding: 2px; display: block; overflow: hidden; height: 40px;">`;
					html += `<div style="float: left; width: 40px; margin-top: -3px;"><psicon pokemon="${p.species}" /></div>`;
					html += `<div style="float: left; padding-top: 1px; line-height: 1.1;">`;
					html += `<strong style="font-size: 11px;">${Dex.species.get(p.species).name}${p.shiny ? ' ✨' : ''}</strong> <span style="font-size: 10px;">Lv${p.level}</span><br/>`;

					const hpPct = Math.floor((p.hp / p.maxHp) * 100);
					const hpColor = hpPct > 50 ? 'green' : (hpPct > 20 ? 'orange' : 'red');
					html += `<div style="width: 60px; height: 4px; border: 1px solid #000; background: #ddd; display: inline-block; vertical-align: middle;"><div style="width: ${hpPct}%; height: 100%; background: ${hpColor};"></div></div>`;
					html += ` <span style="font-size: 9px;">${p.hp}/${p.maxHp} ${p.status ? `[${p.status}]` : ''}</span>`;
					html += `</div>`;
					html += `</button>`;
				} else {
					const cmd = isMoving ? `/sg party move ${context.moving} ${i}` : `/sg party select ${i}`;
					html += `<button name="send" value="${cmd}" style="width: 100%; height: 35px; background: none; border: 1px dashed #aaa; border-radius: 3px; cursor: pointer; color: inherit; margin-bottom: 2px; color: #888;">EMPTY</button>`;
				}
			}
			html += `</div>`;

			// Right pane: Summary (52%)
			html += `<div style="float: right; width: 52%; height: 100%; box-sizing: border-box; padding-left: 5px; overflow-y: auto;">`;
			if (isMoving) {
				html += `<div style="text-align: center; margin-top: 50px;">Select a slot to move <b>${Dex.species.get(player.party[context.moving].species).name}</b> to.</div>`;
				html += `<div style="text-align: center; margin-top: 10px;"><button name="send" value="/sg party" style="background: none; border: 1px solid ${gbDark}; padding: 5px; cursor: pointer; color: inherit;">CANCEL MOVE</button></div>`;
			} else if (context?.selected !== undefined && player.party[context.selected]) {
				const p = player.party[context.selected];
				const species = Dex.species.get(p.species);
				const nextLvlExp = expForLevel(p.level + 1, getExpType(p.species));

				html += `<div style="text-align: center;">`;
				html += `<img src="http://play.pokemonshowdown.com/sprites/ani/${species.id}.gif" alt="${species.name}" style="max-height: 90px;"/><br/>`;
				html += `<b>${species.name.toUpperCase()}${p.shiny ? ' ✨' : ''}</b> Lv${p.level}`;
				html += `</div>`;

				html += `<div style="font-size: 11px; margin-top: 5px; line-height: 1.4;">`;
				html += `<b>Types:</b> ${species.types.join('/')}<br/>`;
				html += `<b>Ability:</b> ${species.abilities[0]}<br/>`;
				html += `<b>Gender:</b> ${p.gender || 'N'}<br/>`;
				html += `<b>Item:</b> ${p.item ? (Dex.items.get(p.item).exists ? Dex.items.get(p.item).name : (SGItems[p.item]?.name || p.item)) : 'None'}<br/>`;
				html += `<b>EXP:</b> ${Math.round(p.exp)} / ${Math.round(nextLvlExp)}<br/>`;
				html += `</div>`;

				html += `<hr style="border-color: ${gbDark}; margin: 5px 0;"/>`;

				html += `<div style="text-align: center; font-size: 11px; font-weight: bold; margin-bottom: 3px;">MOVES</div>`;
				for (const m of p.moves) {
					const move = Dex.moves.get(m);
					html += `<div style="border: 1px solid #666; border-radius: 3px; margin-bottom: 2px; padding: 2px; font-size: 10px; background: rgba(0,0,0,0.05);">`;
					html += `<b>${move.name}</b> <span style="float: right;">${move.type} | ${move.pp}/${move.pp} PP</span>`;
					html += `</div>`;
				}

				html += `<hr style="border-color: ${gbDark}; margin: 5px 0;"/>`;
				html += `<div style="text-align: center; margin-top: 5px;">`;
				html += `<button name="send" value="/sg party move ${context.selected}" style="background: none; border: 1px solid ${gbDark}; color: ${gbDark}; padding: 3px 8px; cursor: pointer; color: inherit; font-size: 10px; border-radius: 3px; display: inline-block; margin: 0 5px;">MOVE POKEMON</button>`;
				if (p.item) {
					html += `<button name="send" value="/sg party takeitem ${context.selected}" style="background: none; border: 1px solid ${gbDark}; color: ${gbDark}; padding: 3px 8px; cursor: pointer; color: inherit; font-size: 10px; border-radius: 3px; display: inline-block; margin: 0 5px;">TAKE ITEM</button>`;
				}
				html += `</div>`;
			} else {
				html += `<div style="text-align: center; margin-top: 50px; color: #666;">Select a Pokemon to view its summary.</div>`;
			}
			html += `</div>`;
			html += `<div style="clear: both;"></div>`;
			html += makeNav("/sg home", "BACK TO MENU ▶");
		} else if (screen === 'bag') {
			const categories = ['Pokeballs', 'Medicine', 'Evolution', 'Held Items', 'Key Items', 'TMs'];
			const currentCat = context?.category || 'Pokeballs';

			// Left pane: Categories (30%)
			html += `<div style="float: left; width: 30%; height: 100%; box-sizing: border-box; padding-right: 5px; border-right: 2px solid ${gbDark}; text-align: center;">`;
			html += `<div style="font-weight: bold; font-size: 11px;">BAG</div><hr style="border-color: ${gbDark}; margin: 5px 0;"/>`;

			for (const cat of categories) {
				const isSel = currentCat === cat;
				const bg = isSel ? 'rgba(0,0,0,0.1)' : 'none';
				html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg bag cat ${cat}" style="width: 100%; background: ${bg}; border: 1px solid ${gbDark}; cursor: pointer; color: inherit; padding: 4px; font-size: 10px; border-radius: 3px;">${cat}</button></div>`;
			}
			html += `</div>`;

			// Right pane: Items or Party Select (70%)
			html += `<div style="float: right; width: 70%; height: 100%; box-sizing: border-box; padding-left: 5px; overflow-y: auto;">`;

			if (context?.usingItem) {
				const item = context.usingItem;
				const itemData = SGItems[item];
				const dexItem = Dex.items.get(item);
				const itemName = dexItem.exists ? dexItem.name : (itemData?.name || item);

				const verb = itemData?.category === 'Held Items' ? 'Give' : 'Use';
				html += `<div style="text-align: center; font-weight: bold;">${verb} ${itemName} to which Pokemon?</div><hr style="border-color: ${gbDark}; margin: 5px 0;"/>`;

				for (let i = 0; i < 6; i++) {
					const p = player.party[i];
					if (p) {
						const cmd = itemData?.category === 'Held Items' ? 'give' : 'use';
						html += `<div style="margin-bottom: 5px;"><button name="send" value="/sg bag ${cmd} ${item} ${i}" style="width: 100%; background: none; border: 1px solid ${gbDark}; border-radius: 3px; cursor: pointer; color: inherit; text-align: left; padding: 4px; display: block; overflow: hidden;">`;
						html += `<div style="float: left; width: 40px; margin-top: -5px;"><psicon pokemon="${p.species}" /></div>`;
						html += `<div style="float: left; padding-top: 2px; line-height: 1.2;">`;
						html += `<strong style="font-size: 11px;">${Dex.species.get(p.species).name}</strong> <span style="font-size: 10px;">Lv${p.level}</span><br/>`;

						const hpPct = Math.floor((p.hp / p.maxHp) * 100);
						const hpColor = hpPct > 50 ? 'green' : (hpPct > 20 ? 'orange' : 'red');
						html += `<div style="width: 60px; height: 4px; border: 1px solid #000; background: #ddd; display: inline-block; vertical-align: middle;"><div style="width: ${hpPct}%; height: 100%; background: ${hpColor};"></div></div>`;
						html += ` <span style="font-size: 9px;">${p.hp}/${p.maxHp} ${p.status ? `[${p.status}]` : ''}</span>`;
						html += `</div>`;
						html += `</button></div>`;
					}
				}
				html += `<div style="text-align: center; margin-top: 10px;"><button name="send" value="/sg bag cat ${currentCat}" style="background: none; border: 1px solid ${gbDark}; padding: 3px 8px; cursor: pointer; color: inherit; border-radius: 3px;">CANCEL</button></div>`;
			} else {
				html += `<div style="font-weight: bold; font-size: 11px; text-align: center;">${currentCat.toUpperCase()}</div><hr style="border-color: ${gbDark}; margin: 5px 0;"/>`;

				let foundAny = false;
				for (const [item, count] of Object.entries(player.bag)) {
					const itemData = SGItems[item];
					if (itemData && itemData.category === currentCat && count > 0) {
						foundAny = true;

						const dexItem = Dex.items.get(item);
						const itemName = dexItem.exists ? dexItem.name : itemData.name;
						const itemDesc = dexItem.exists ? (dexItem.desc || dexItem.shortDesc) : itemData.description;

						html += `<div style="border: 1px solid #ccc; border-radius: 3px; padding: 4px; margin-bottom: 5px; background: rgba(255,255,255,0.5);">`;
						html += `<strong style="font-size: 12px;">${itemName}</strong> <span style="float: right; font-weight: bold;">x${count}</span><br/>`;
						html += `<div style="font-size: 10px; color: #555; margin: 3px 0;">${itemDesc}</div>`;
						if (currentCat === 'Medicine' || currentCat === 'TMs' || currentCat === 'Evolution') {
							html += `<button name="send" value="/sg bag use ${item}" style="background: none; border: 1px solid ${gbDark}; cursor: pointer; color: inherit; font-size: 10px; padding: 2px 10px; border-radius: 3px;">USE</button>`;
						} else if (currentCat === 'Held Items') {
							html += `<button name="send" value="/sg bag give ${item}" style="background: none; border: 1px solid ${gbDark}; cursor: pointer; color: inherit; font-size: 10px; padding: 2px 10px; border-radius: 3px;">GIVE</button>`;
						}
						html += `</div>`;
					}
				}

				if (!foundAny) {
					html += `<div style="text-align: center; color: #666; margin-top: 20px; font-size: 11px;">You don't have any items in this category.</div>`;
				}
			}

			html += `</div>`;
			html += `<div style="clear: both;"></div>`;
			html += makeNav("/sg home", "EXIT BAG ▶");
		} else if (screen === 'confirmreset') {
			html += `<div><strong style="color: darkred;">WARNING!</strong><hr style="border-color: darkred;"/></div>`;
			html += `<div>Are you sure you want to reset your run? This will delete all your Pokemon and items!</div><br/>`;
			html += `<div style="overflow: hidden;">`;
			html += `<button name="send" value="/sg reset" style="width: 48%; float: left; padding: 5px; background: none; border: 1px solid darkred; color: darkred; font-weight: bold; cursor: pointer; color: inherit;">YES, RESET</button>`;
			html += `<button name="send" value="/sg home" style="width: 48%; float: right; padding: 5px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit;">CANCEL</button>`;
			html += `</div>`;
		} else if (screen === 'wild') {
			const enemy = context.enemy;
			const dexSp = Dex.species.get(enemy.species);
			const isShiny = enemy.shiny ? ' <span style="color: #c98e00; font-size: 11px;">✨ SHINY!</span>' : '';
			html += `<div><psicon pokemon="${enemy.species}" /> A wild <strong>${dexSp.name.toUpperCase()}</strong> Lv${enemy.level}${isShiny} appeared!</div>`;
			html += `<div style="font-size: 10px; color: #666; margin-top: 2px;">Location: ${player.location} | Types: ${dexSp.types.join('/')}</div><br/>`;
			html += `<div style="overflow: hidden;">`;
			html += `<button name="send" value="/sg battle" style="width: 48%; float: left; padding: 5px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit;">BATTLE</button>`;
			html += `<button name="send" value="/sg home" style="width: 48%; float: right; padding: 5px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit;">RUN</button>`;
			html += `</div>`;
		} else if (screen === 'victory') {
			const enemy = context.wildPoke;
			html += `<div style="text-align: center; margin-top: 0px;"><div style="display: inline-block; filter: grayscale(100%); opacity: 0.6; transform: scale(1.5);"><psicon pokemon="${enemy.species}" /></div></div>`;
			html += `<div style="text-align: center; font-weight: bold; margin-top: 10px; font-size: 13px;">Wild ${Dex.species.get(enemy.species).name.toUpperCase()} fainted!</div>`;
			if (context.battleReport && context.battleReport.length > 0) {
				html += `<div style="border: 3px solid ${gbDark}; border-radius: 6px; background: #fff; padding: 8px; margin: 15px 5px; font-size: 12px; line-height: 1.5; max-height: 220px; overflow-y: auto; box-shadow: 2px 2px 0px rgba(0,0,0,0.15);">`;
				for (const repMsg of context.battleReport) {
					html += `<div>${repMsg}</div>`;
				}
				html += `</div>`;
			}
			html += `${makeNav("/sg continue", "CONTINUE ▶")}`;
		} else if (screen === 'defeat') {
			html += `<div style="text-align: center; margin-top: 10px; font-size: 24px;">&#9760;</div>`;
			html += `<div style="text-align: center; font-weight: bold; margin-top: 10px; font-size: 13px;">You have no more Pokemon that can fight!</div>`;
			html += `<div style="border: 3px solid ${gbDark}; border-radius: 6px; background: #fff; padding: 8px; margin: 15px 5px; font-size: 12px; line-height: 1.5; box-shadow: 2px 2px 0px rgba(0,0,0,0.15);">You panicked and dropped some money...<br/><br/>You blacked out!</div>`;
			html += `${makeNav("/sg heal", "RETURN TO CENTER ▶")}`;
		} else if (screen === 'caught') {
			const enemy = context.wildPoke;
			html += `<div style="text-align: center; margin-top: 0px;"><div style="display: inline-block; transform: scale(1.5);"><psicon pokemon="${enemy.species}" /></div></div>`;
			html += `<div style="text-align: center; font-weight: bold; margin-top: 10px; font-size: 13px;">Gotcha! ${Dex.species.get(enemy.species).name.toUpperCase()}${enemy.shiny ? ' ✨' : ''} was caught!</div>`;
			if (context.sentToPC) html += `<div style="text-align: center; font-size: 11px; margin-top: 5px;">${Dex.species.get(enemy.species).name.toUpperCase()} was sent to the PC!</div>`;
			if (context.battleReport && context.battleReport.length > 0) {
				html += `<div style="border: 3px solid ${gbDark}; border-radius: 6px; background: #fff; padding: 8px; margin: 15px 5px; font-size: 12px; line-height: 1.5; max-height: 220px; overflow-y: auto; box-shadow: 2px 2px 0px rgba(0,0,0,0.15);">`;
				for (const repMsg of context.battleReport) {
					html += `<div>${repMsg}</div>`;
				}
				html += `</div>`;
			}
			html += `${makeNav("/sg continue", "CONTINUE ▶")}`;
		} else if (screen === 'evolution') {
			const p = player.party[context.partyIndex];
			const evoSp = Dex.species.get(context.evoSpecies);
			html += `<div><strong>EVOLUTION!</strong><hr style="border-color: ${gbDark};"/></div>`;
			html += `<div>What? <psicon pokemon="${p.species}" /> <strong>${Dex.species.get(p.species).name.toUpperCase()}</strong> is evolving!</div><br/>`;
			html += `<div>Let it evolve into <psicon pokemon="${evoSp.id}" /> <strong>${evoSp.name.toUpperCase()}</strong>?</div><br/>`;
			html += `<div style="overflow: hidden;">`;
			html += `<button name="send" value="/sg evolve confirm" style="width: 48%; float: left; padding: 5px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit;">YES</button>`;
			html += `<button name="send" value="/sg evolve cancel" style="width: 48%; float: right; padding: 5px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit;">NO</button>`;
			html += `</div>`;
		} else if (screen === 'evolved') {
			html += `<div><strong>EVOLUTION!</strong><hr style="border-color: ${gbDark};"/></div>`;
			html += `<div>Congratulations! Your <strong>${context.oldName}</strong> evolved into <psicon pokemon="${context.species}" /> <strong>${context.newName}</strong>!</div><br/>`;
			html += `${makeNav("/sg continue", "CONTINUE ▶")}`;
		} else if (screen === 'learnmove') {
			const p = player.party[context.partyIndex];
			const newMove = Dex.moves.get(context.move);
			html += `<div><strong>NEW MOVE!</strong><hr style="border-color: ${gbDark};"/></div>`;
			html += `<div><psicon pokemon="${p.species}" style="vertical-align: middle;"/> <strong>${Dex.species.get(p.species).name.toUpperCase()}</strong> wants to learn <strong>${newMove.name}</strong>!</div>`;
			html += `<div style="font-size: 0.9em; margin-bottom: 5px;"><em>Type: ${newMove.type} | Cat: ${newMove.category} | Pwr: ${newMove.basePower || '—'} | Acc: ${newMove.accuracy === true ? '—' : newMove.accuracy}</em></div>`;
			html += `<div style="font-size: 0.85em; margin-bottom: 10px;">${newMove.shortDesc || newMove.desc || ''}</div>`;
			html += `<div style="font-size: 0.9em; margin-bottom: 5px;">Choose a move to forget:</div>`;
			html += `<div style="margin-bottom: 10px;">`;
			for (let i = 0; i < p.moves.length; i++) {
				const oldMove = Dex.moves.get(p.moves[i]);
				html += `<button name="send" value="/sg learnmove replace, ${i}" style="padding: 5px; background: none; border: 1px solid ${gbDark}; color: ${gbDark}; font-weight: bold; cursor: pointer; color: inherit; text-align: left; width: 100%; display: block; margin-bottom: 5px;">`;
				html += `<strong>${oldMove.name}</strong> <span style="font-size: 0.8em; float: right;">${oldMove.type} | ${oldMove.category} | Pwr: ${oldMove.basePower || '—'}</span>`;
				html += `</button>`;
			}
			html += `</div>`;
			html += makeNav("/sg learnmove cancel", `GIVE UP ▶`);
		}

		html += `</div>`; // Close scrolling content div

		if (msg) {
			const contextStr = context ? JSON.stringify(context).replace(/"/g, '&quot;') : '';
			html += `<div style="height: 22px; background: rgba(0,0,0,0.85); color: white; line-height: 22px; padding: 0 10px; font-size: 11px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">`;
			html += `${msg}`;
			html += `<button name="send" value="/sg dismissmsg ${screen}|${contextStr}" style="float: right; background: none; border: none; color: #ccc; cursor: pointer; color: inherit; font-weight: bold; line-height: 22px; padding: 0 5px; margin-right: -5px;">X</button>`;
			html += `</div>`;
		}

		html += `</div>`; // Close screen bezel div
		// GBA Controls chin
		html += `<div style="padding: 2px 15px 3px 15px; overflow: hidden;">`;
		// D-Pad (left)
		html += `<div style="float: left; width: 54px; height: 54px; position: relative;">
			<div style="position: absolute; top: 0; left: 18px; width: 18px; height: 18px; background: #2a2a3a; border-radius: 2px 2px 0 0;"></div>
			<div style="position: absolute; top: 18px; left: 0; width: 18px; height: 18px; background: #2a2a3a; border-radius: 2px 0 0 2px;"></div>
			<div style="position: absolute; top: 18px; left: 18px; width: 18px; height: 18px; background: #2a2a3a;"></div>
			<div style="position: absolute; top: 18px; left: 36px; width: 18px; height: 18px; background: #2a2a3a; border-radius: 0 2px 2px 0;"></div>
			<div style="position: absolute; top: 36px; left: 18px; width: 18px; height: 18px; background: #2a2a3a; border-radius: 0 0 2px 2px;"></div>
		</div>`;
		// A/B Buttons (right)
		html += `<div style="float: right; transform: rotate(-25deg); margin-top: 5px;">
			<div style="display: inline-block; width: 24px; height: 24px; border-radius: 50%; background: #3a3a4a; box-shadow: inset -1px -1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3); text-align: center; line-height: 24px; color: #9a8ec4; font-size: 9px; font-weight: bold;">B</div>
			<div style="display: inline-block; width: 24px; height: 24px; border-radius: 50%; background: #3a3a4a; box-shadow: inset -1px -1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3); text-align: center; line-height: 24px; color: #9a8ec4; font-size: 9px; font-weight: bold; margin-top: -12px;">A</div>
		</div>`;
		// Start/Select (center)
		html += `<div style="text-align: center; padding-top: 15px;">
			<div style="display: inline-block; width: 30px; height: 7px; background: #2a2a3a; border-radius: 4px; transform: rotate(-25deg); margin-right: 8px;"></div>
			<div style="display: inline-block; width: 30px; height: 7px; background: #2a2a3a; border-radius: 4px; transform: rotate(-25deg);"></div>
		</div>`;
		html += `</div>`; // Close controls

		html += `</div>`; // Close shell div
		return html.replace(/\n/g, '');
	},
};
