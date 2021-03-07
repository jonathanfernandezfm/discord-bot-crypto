const db = require('megadb');
let guildsdb = new db.crearDB({
	nombre: 'guilds',
	carpeta: '../database',
});

module.exports = {
	setPrefix: async (id, prefix) => {
		const res = await guildsdb.establecer(`${id}.prefix`, prefix);
		return res;
	},

	getPrefix: async (id) => {
		const res = await guildsdb.obtener(`${id}.prefix`);
		return res;
	},

	setPremium: async (id) => {
		const check = await guildsdb.obtener(`${id}`);
		if (!check) throw Error(`guild does not exist`);
		const res = await guildsdb.establecer(`${id}.premium`, true);
		return res;
	},

	getPremium: async (id) => {
		const res = await guildsdb.obtener(`${id}.premium`);
		return res;
	},

	setInactive: async (id, inactive) => {
		const res = await guildsdb.establecer(`${id}.inactive`, inactive);
		return res;
	},

	setDefaultPlatform: async (id, platform) => {
		const res = await guildsdb.establecer(`${id}.platform`, platform);
		return res;
	},

	getDefaultPlatform: async (id) => {
		const res = await guildsdb.obtener(`${id}.platform`);
		return res;
	},

	addNotificationChannel: async (id, channel) => {
		const res = await guildsdb.establecer(`${id}.notifChannel`, channel);
		return res;
	},

	removeNotificationChannel: async (id) => {
		const res = await guildsdb.eliminar(`${id}.notifChannel`);
		return res;
	},

	getChannel: async (id) => {
		const res = await guildsdb.obtener(`${id}.notifChannel`);
		return res;
	},

	addEthermineChannel: async (id, channel) => {
		const res = await guildsdb.establecer(`${id}.ethermineChannel`, channel);
		return res;
	},

	removeEthermineChannel: async (id) => {
		const res = await guildsdb.eliminar(`${id}.ethermineChannel`);
		return res;
	},

	getEthermineChannel: async (id) => {
		const res = await guildsdb.obtener(`${id}.ethermineChannel`);
		return res;
	},

	getGuilds: async () => {
		const res = await guildsdb.keys();
		return res;
	},
};
