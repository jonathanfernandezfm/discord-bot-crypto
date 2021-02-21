const { default: axios } = require('axios');
const cron = require('node-cron');
const cryptoController = require('../controller/coins');
const pricesController = require('../controller/prices');
const guildsController = require('../controller/guilds');

const API_BINANCE_URL = 'https://api.binance.com';

const getPlusMinusSymbol = (value) => {
	return value < 0 ? '' : '+';
};

const getColor = (value) => {
	return value < 0 ? '#ff4444' : '#88ff88';
};

const getTitle = (value, symbol) => {
	return value < 0 ? `📉📉 ${symbol} change ❗` : `📈📈 ${symbol} change ❕`;
};

const fixedPrice = (value) => {
	return parseFloat(value).toFixed(2);
};

const changeNotification = async (client, Discord) => {
	const guilds = await guildsController.getGuilds();

	try {
		guilds.forEach(async (guild_id) => {
			const guild = client.guilds.cache.get(guild_id);
			const channel_id = await guildsController.getChannel(guild_id);
			if (!channel_id) return;
			const channel = guild.channels.cache.get(channel_id);
			const pairs = await cryptoController.listCoins(guild_id);
			if (!pairs) return;

			pairs.forEach(async ({ pair, percentage }) => {
				const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
				const { symbol, price } = ticker.filter((t) => t.symbol === pair)[0];
				let last_price = await pricesController.getPrice(guild_id, pair);
				if (!last_price)
					last_price = await pricesController.setPrice(guild_id, pair, price);

				const perc_change_last_price = ((price - last_price) / last_price) * 100;
				const money_change_last_price = price - last_price;

				if (Math.abs(perc_change_last_price) > percentage) {
					pricesController.setPrice(guild_id, pair, price);

					const changePriceEmbed = new Discord.MessageEmbed()
						.setColor(`${getColor(perc_change_last_price)}`)
						.setAuthor(
							`${getTitle(perc_change_last_price, symbol)}`,
							'https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0028/4238/imagen-bitcoin.png?1508147409'
						)
						.addFields(
							{ name: 'Coin', value: `${symbol}`, inline: true },
							{
								name: '\u200B',
								value: '\u200B',
								inline: true,
							},
							{
								name: 'Current price',
								value: `${fixedPrice(price)}€`,
								inline: true,
							},
							{
								name: 'Money change',
								value: `${getPlusMinusSymbol(money_change_last_price)}${fixedPrice(
									money_change_last_price
								)}€`,
								inline: true,
							},
							{
								name: '\u200B',
								value: '\u200B',
								inline: true,
							},
							{
								name: 'Last price',
								value: `${fixedPrice(last_price)}€`,
								inline: true,
							},
							{
								name: '% Change',
								value: `${getPlusMinusSymbol(
									perc_change_last_price
								)}${perc_change_last_price}%`,
								inline: true,
							},
							{ name: 'Platform', value: `Binance` }
						)
						.setTimestamp();

					channel.send(changePriceEmbed);
				}
			});
		});
	} catch (err) {
		console.log(err.message);
	}
};

module.exports = {
	createCron: (client, Discord) => {
		cron.schedule('*/10 * * * * *', () => {
			console.log('Running change notification');
			changeNotification(client, Discord);
		});
	},
};
