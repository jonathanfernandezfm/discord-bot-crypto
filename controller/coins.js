const db = require('megadb');
let cryptodb = new db.crearDB({
	nombre: 'crypto',
	carpeta: '../database',
});

module.exports = {
	addCoin: async (id, trade_in, trade_out, percentage, interval) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs) {
			const exists = pairs.filter((p) => p.trade_in === trade_in && p.trade_out === trade_out);
			if (!exists.length)
				pairs.push({ trade_in: trade_in, trade_out: trade_out, percentage: percentage, interval: interval });
			else
				throw Error(
					`pair already being tracked \`${exists[0].trade_in}${exists[0].trade_out} ${exists[0].percentage}%\``
				);
		} else {
			pairs = [{ trade_in: trade_in, trade_out: trade_out, percentage: percentage, interval: interval }];
		}

		const res = await cryptodb.establecer(`${id}.pairs`, pairs);
		return res;
	},

	editCoin: async (id, trade_in, trade_out, percentage, interval) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs && pairs.length) {
			const exists = pairs.filter((p) => p.trade_in === trade_in && p.trade_out === trade_out);
			if (exists.length) {
				pairs.forEach((p) => {
					if (p.trade_in === trade_in && p.trade_out === trade_out) {
						p.percentage = percentage;
						p.interval = interval;
					}
				});
			} else {
				throw Error(`pair is not being tracked. Use \`#track\` to add it`);
			}
		} else throw Error(`pair is not being tracked. Use \`#track\` to add it`);

		const res = await cryptodb.establecer(`${id}.pairs`, pairs);
		return res;
	},

	removeCoin: async (id, trade_in, trade_out) => {
		let pairs = await cryptodb.obtener(`${id}.pairs`);

		if (pairs && pairs.length) {
			const exists = pairs.filter((p) => p.trade_in === trade_in && p.trade_out === trade_out);
			if (exists.length) {
				pairs = pairs.filter((p) => p.trade_in !== trade_in && p.trade_out !== trade_out);
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
