const db = require('megadb');
let cryptodb = new db.crearDB({
	nombre: 'crypto',
	carpeta: '../database',
});

module.exports = {
	addNotificationChannel: async (id, channel) => {
		const res = await cryptodb.establecer(`${id}.notifChannel`, channel);
		return res;
	},

	removeNotificationChannel: async (id) => {
		const res = await cryptodb.eliminar(`${id}.notifChannel`);
		return res;
	},

	getChannel: async (id) => {
		const res = await cryptodb.obtener(`${id}.notifChannel`);
		return res;
	},

	getGuilds: async () => {
		const res = await cryptodb.keys();
		return res;
	},
};
