const currentPricesNotification = async (client, Discord) => {
	// const guild = client.guilds.cache.get(GUILD);
	// const channel = guild.channels.cache.get(NOTIF_CHANNEL);
	// const cryptos_check = crypto.cron_symbols;
	// cryptos_check.forEach(async (symbol) => {
	// 	try {
	// 		const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
	// 		const symbol_price = ticker.filter((t) => t.symbol === symbol)[0];
	// 		const { data: change_price_24 } = await axios.get(
	// 			`${API_BINANCE_URL}/api/v3/ticker/24hr`
	// 		);
	// 		const change_price = change_price_24.filter((t) => t.symbol === symbol)[0];
	// 		const currentPriceEmbed = new Discord.MessageEmbed()
	// 			.setColor('#e3c500')
	// 			.setAuthor(
	// 				`${symbol} current price`,
	// 				'https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0028/4238/imagen-bitcoin.png?1508147409'
	// 			)
	// 			.addFields(
	// 				{ name: 'Coin', value: `${symbol}`, inline: true },
	// 				{
	// 					name: '\u200B',
	// 					value: '\u200B',
	// 					inline: true,
	// 				},
	// 				{
	// 					name: '% Change 24h',
	// 					value: `${getPlusMinusSymbol(change_price.priceChangePercent)}${
	// 						change_price.priceChangePercent
	// 					}%`,
	// 					inline: true,
	// 				},
	// 				{
	// 					name: 'Price',
	// 					value: `${fixedPrice(symbol_price.price)}€`,
	// 					inline: true,
	// 				},
	// 				{
	// 					name: '\u200B',
	// 					value: '\u200B',
	// 					inline: true,
	// 				},
	// 				{
	// 					name: 'Money change 24h',
	// 					value: `${getPlusMinusSymbol(change_price.priceChange)}${fixedPrice(
	// 						change_price.priceChange
	// 					)}€`,
	// 					inline: true,
	// 				},
	// 				{ name: 'Platform', value: `Binance` }
	// 			)
	// 			.setTimestamp();
	// 		channel.send(currentPriceEmbed);
	// 	} catch (err) {
	// 		console.error(err.message);
	// 	}
	// });
};

module.exports = {
	createCron: (client, Discord) => {
		// cron.schedule('*/10 * * * * *', () => {
		// 	console.log('Running current prices notification');
		// 	currentPricesNotification(client, Discord);
		// });
	},
};
