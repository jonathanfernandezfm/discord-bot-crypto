const db = require('megadb');
let cryptodb = new db.crearDB({
	nombre: 'crypto',
	carpeta: '../database',
});

module.exports = {
	addCoin: async (id, pair, percentage) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs) {
			const exists = pairs.filter((p) => p.pair === pair);
			if (!exists.length) pairs.push({ pair: pair, percentage: percentage });
			else
				throw Error(
					`pair already being tracked \`${exists[0].pair} ${exists[0].percentage}%\``
				);
		} else {
			pairs = [{ pair: pair, percentage: percentage }];
		}

		const res = await cryptodb.establecer(`${id}.pairs`, pairs);
		return res;
	},

	editCoin: async (id, pair, percentage) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs && pairs.length) {
			const exists = pairs.filter((p) => p.pair === pair);
			if (exists.length) {
				pairs.forEach((p) => {
					if (p.pair === pair) p.percentage = percentage;
				});
			} else {
				throw Error(`pair is not being tracked. Use \`#track\` to add it`);
			}
		} else throw Error(`pair is not being tracked. Use \`#track\` to add it`);

		const res = await cryptodb.establecer(`${id}.pairs`, pairs);
		return res;
	},

	removeCoin: async (id, pair) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs && pairs.length) {
			const exists = pairs.filter((p) => p.pair === pair);
			if (exists.length) {
				pairs = pairs.filter((p) => p.pair !== pair);
			} else {
				throw Error(`pair is not being tracked`);
			}
		} else throw Error(`pair is not being tracked`);

		const res = await cryptodb.establecer(`${id}.pairs`, pairs);
		return res;
	},

	listCoins: async (id) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs) return pairs;
	},
};
