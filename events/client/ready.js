const changeNotifications = require('../../crons/change-notifications');

module.exports = (Discord, client) => {
	console.log('Bot is online!');

	client.user
		.setActivity('Crypto Trading\n!help or tag me for help', {
			type: 'PLAYING',
		})
		.catch(console.error);

	changeNotifications.createCron(client, Discord);
	// setInterval(() => {
	// 	binance_cron.changeCron(client, Discord);
	// }, 300000);

	// setInterval(() => {
	// 	binance_cron.currentPriceCron(client, Discord);
	// }, 3600000);
};
