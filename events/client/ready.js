module.exports = (Discord, client) => {
	console.log('Bot is online!');

	client.user
		.setActivity('Crypto Trading\n!help or tag me for help', {
			type: 'PLAYING',
		})
		.catch(console.error);
};
