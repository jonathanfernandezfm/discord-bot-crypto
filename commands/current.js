const { default: axios } = require('axios');
const serverController = require('../controller/server');

const API_BINANCE_URL = 'https://api.binance.com';

const getPlusMinusSymbol = (value) => {
	return value < 0 ? '' : '+';
};

const fixedPrice = (value) => {
	return parseFloat(value).toString();
};

module.exports = {
	name: 'current',
	description: 'Shows current crypto currency price',
	cooldown: 5,
	help: 'current {pair}',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await serverController.getPrefix(msg.channel.guild.id)) || '!';
		if (!args[0]) return msg.reply(`enter a crypto pair \`${prefix}current {pair}\``);

		let pair = args[0].toUpperCase();
		if (pair.length < 4) pair += 'BTC';

		try {
			const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
			const symbol_price = ticker.filter((t) => t.symbol === pair);
			if (!symbol_price.length) return msg.reply(`pair \`${pair}\` does not exist`);

			const pair_info = symbol_price[0];

			const { data: change_price_24 } = await axios.get(
				`${API_BINANCE_URL}/api/v3/ticker/24hr`
			);
			const change_price = change_price_24.filter((t) => t.symbol === pair)[0];

			const currentPriceEmbed = new Discord.MessageEmbed()
				.setColor('#e3c500')
				.setAuthor(
					`${pair} current price`,
					'https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0028/4238/imagen-bitcoin.png?1508147409'
				)
				.addFields(
					{ name: 'Coin', value: `${pair}`, inline: true },
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
						value: `${fixedPrice(pair_info.price)}`,
						inline: true,
					},
					{
						name: '\u200B',
						value: '\u200B',
						inline: true,
					},
					{
						name: 'Change 24h',
						value: `${getPlusMinusSymbol(change_price.priceChange)}${fixedPrice(
							change_price.priceChange
						)}`,
						inline: true,
					},
					{ name: 'Platform', value: `Binance` }
				)
				.setTimestamp();

			msg.channel.send(currentPriceEmbed);
		} catch (err) {
			console.error(err.message);
		}
	},
};
