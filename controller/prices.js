const db = require('megadb');
let cryptodb = new db.crearDB({
	nombre: 'crypto',
	carpeta: '../database',
});

module.exports = {
	setPrice: async (id, pair, price) => {
		let prices = await cryptodb.obtener(`${id}.prices`);

		if (prices && prices.length) {
			const exists = prices.filter((p) => p.pair === pair);
			if (exists.length) {
				prices.forEach((p) => {
					if (p.pair === pair) p.price = price;
				});
			} else prices.push({ pair: pair, price: price });
		} else prices = [{ pair: pair, price: price }];

		const res = await cryptodb.establecer(`${id}.prices`, prices);
		return price;
	},

	getPrice: async (id, pair) => {
		let prices = await cryptodb.obtener(`${id}.prices`);

		if (prices && prices.length) {
			const exists = prices.find((p) => p.pair === pair);
			if (exists) return exists.price;
			else return null;
		} else return null;
	},
	getPrices: async (id) => {
		let prices = await cryptodb.obtener(`${id}.prices`);

		return prices;
	},
};
