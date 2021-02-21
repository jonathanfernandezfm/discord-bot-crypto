const db = require('megadb');
let serverdb = new db.crearDB({
	nombre: 'guilds',
	carpeta: '../database',
});

module.exports = {
	setPrefix: async (id, prefix) => {
		const res = await serverdb.establecer(`${id}.prefix`, prefix);
		return res;
	},

	getPrefix: async (id) => {
		const res = await serverdb.obtener(`${id}.prefix`);
		return res;
	},
};
