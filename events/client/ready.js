const binance_cron = require('../../crons/binance');

module.exports = (Discord, client) => {
	console.log('Bot is online!');

	client.user
		.setActivity('Crypto Trading', {
			type: 'PLAYING',
		})
		.catch(console.error);

	setInterval(() => {
		binance_cron.changeCron(client, Discord);
	}, 300000);

	setInterval(() => {
		binance_cron.currentPriceCron(client, Discord);
	}, 3600000);
};
