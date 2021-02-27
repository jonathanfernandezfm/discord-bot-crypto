const db = require('megadb');
let cryptodb = new db.crearDB({
	nombre: 'crypto',
	carpeta: '../database',
});

module.exports = {
	setPrice: async (id, trade_in, trade_out, price) => {
		let prices = await cryptodb.obtener(`${id}.prices`);

		if (prices && prices.length) {
			const exists = prices.filter((p) => p.trade_in === trade_in && p.trade_out === trade_out);
			if (exists.length) {
				prices.forEach((p) => {
					if (p.trade_in === trade_in && p.trade_out === trade_out) p.price = price;
				});
			} else prices.push({ trade_in: trade_in, trade_out: trade_out, price: price });
		} else prices = [{ trade_in: trade_in, trade_out: trade_out, price: price }];

		const res = await cryptodb.establecer(`${id}.prices`, prices);
		return price;
	},

	getPrice: async (id, trade_in, trade_out) => {
		let prices = await cryptodb.obtener(`${id}.prices`);

		if (prices && prices.length) {
			const exists = prices.find((p) => p.trade_in === trade_in && p.trade_out === trade_out);
			if (exists) return exists.price;
			else return null;
		} else return null;
	},

	getPrices: async (id) => {
		let prices = await cryptodb.obtener(`${id}.prices`);

		return prices;
	},
};
