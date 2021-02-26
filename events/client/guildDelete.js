const guildsController = require('../../controller/guilds');

module.exports = async (Discord, client, guild) => {
	await guildsController.setInactive(guild.id, true);

	console.log(`Instance set inactive for guild ${guild.name} (${guild.id})`);
};
