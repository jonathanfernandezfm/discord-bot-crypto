const db = require('megadb');
let walletsdb = new db.crearDB({
	nombre: 'wallets',
	carpeta: '../database',
});

module.exports = {
	setEthermineWallet: async (id, search) => {
		const wallets = await walletsdb.obtener(`${id}.wallets`);
		const res = wallets.find((w) => w.name === search || w.wallet === search);

		if (!res) throw Error(`wallet ${wallet} not found.`);

		return await walletsdb.establecer(`${id}.ethermine_wallet`, res.wallet);
	},
	getEthermineWallet: async (id) => {
		const wallet = await walletsdb.obtener(`${id}.ethermine_wallet`);

		return wallet;
	},
	addWallet: async (id, wallet, name) => {
		let wallets = await walletsdb.obtener(`${id}.wallets`);

		if (wallets && wallets.length) {
			const exist = wallets.find((w) => w.wallet === wallet);

			if (exist) throw Error(`wallet \`${wallet}\` already exist`);

			wallets.push({ name: name, wallet: wallet });
		} else {
			wallets = [{ name: name, wallet: wallet }];
		}

		return await walletsdb.establecer(`${id}.wallets`, wallets);
	},

	getWallet: async (id, wallet) => {
		const wallets = await walletsdb.obtener(`${id}.wallets`);
		const res = wallets.filter((w) => w.wallet === wallet);

		if (res) return res;
		else throw Error(`wallet ${wallet} not found.`);
	},

	listWallets: async (id) => {
		const res = await walletsdb.obtener(`${id}.wallets`);
		return res;
	},

	removeWallet: async (id, search) => {
		const wallets = await walletsdb.obtener(`${id}.wallets`);

		if (wallets && wallets.length) {
			const removed = wallets.filter((w) => w.wallet !== search && w.name !== search);
			return await walletsdb.establecer(`${id}.wallets`, removed);
		}

		throw Error(`wallet \`${search}\` not found`);
	},

	saveLastPayout: async (id, date) => {
		return await walletsdb.establecer(`${id}.ethermine_lastpayout`, date);
	},

	getLastPayout: async (id) => {
		return await walletsdb.obtener(`${id}.ethermine_lastpayout`);
	},
};
