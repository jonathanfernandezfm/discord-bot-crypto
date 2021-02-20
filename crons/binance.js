const { default: axios } = require('axios');
const crypto = require('../db/crypto.json');
const fs = require('fs');

const API_BINANCE_URL = 'https://api.binance.com';
const GUILD = '805756688820207627';
const NOTIF_CHANNEL = '812004104167620638';

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

module.exports = {
	changeCron: (client, Discord) => {
		const guild = client.guilds.cache.get(GUILD);
		const channel = guild.channels.cache.get(NOTIF_CHANNEL);

		const cryptos_check = crypto.cron_symbols;
		let data = crypto.data;

		cryptos_check.forEach(async (symbol) => {
			try {
				const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
				const symbol_price = ticker.filter((t) => t.symbol === symbol)[0];

				const perc_change_last_price =
					((symbol_price.price - data[symbol].last_price) / data[symbol].last_price) *
					100;
				const money_change_last_price = symbol_price.price - data[symbol].last_price;
				const limit_change = data[symbol].limit_change;

				console.log(symbol);
				console.log(symbol_price);
				console.log(data[symbol].last_price);
				console.log(perc_change_last_price);
				console.log(money_change_last_price);
				console.log(limit_change);
				console.log('\n');

				if (Math.abs(perc_change_last_price) > limit_change) {
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
								value: `${fixedPrice(symbol_price.price)}€`,
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
								value: `${fixedPrice(data[symbol].last_price)}€`,
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

				crypto.data[symbol].last_price = symbol_price.price;

				fs.writeFileSync('db/crypto.json', JSON.stringify(crypto));
			} catch (err) {
				console.error(err.message);
			}
		});
	},
	currentPriceCron: async (client, Discord) => {
		const guild = client.guilds.cache.get(GUILD);
		const channel = guild.channels.cache.get(NOTIF_CHANNEL);

		const cryptos_check = crypto.cron_symbols;

		cryptos_check.forEach(async (symbol) => {
			try {
				const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
				const symbol_price = ticker.filter((t) => t.symbol === symbol)[0];

				const { data: change_price_24 } = await axios.get(
					`${API_BINANCE_URL}/api/v3/ticker/24hr`
				);
				const change_price = change_price_24.filter((t) => t.symbol === symbol)[0];

				const currentPriceEmbed = new Discord.MessageEmbed()
					.setColor('#e3c500')
					.setAuthor(
						`${symbol} current price`,
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
							name: '% Change 24h',
							value: `${getPlusMinusSymbol(change_price.priceChangePercent)}${
								change_price.priceChangePercent
							}%`,
							inline: true,
						},
						{
							name: 'Price',
							value: `${fixedPrice(symbol_price.price)}€`,
							inline: true,
						},
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: 'Money change 24h',
							value: `${getPlusMinusSymbol(change_price.priceChange)}${fixedPrice(
								change_price.priceChange
							)}€`,
							inline: true,
						},
						{ name: 'Platform', value: `Binance` }
					)
					.setTimestamp();

				channel.send(currentPriceEmbed);
			} catch (err) {
				console.error(err.message);
			}
		});
	},
};
