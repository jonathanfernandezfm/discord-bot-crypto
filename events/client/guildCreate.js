const guildsController = require('../../controller/guilds');

module.exports = async (Discord, client, guild) => {
	await guildsController.setPrefix(guild.id, '!');
	await guildsController.setInactive(guild.id, false);
	await guildsController.setPremium(guild.id, false);
	await guildsController.setDefaultPlatform(guild.id, 'binance');

	console.log(`Instance created for guild ${guild.name} (${guild.id})`);
};
