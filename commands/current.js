const { default: axios } = require('axios');
const guildsController = require('../controller/guilds');
const { getPlusMinusSymbol, fixedPrice } = require('../utils/utils');

const API_BINANCE_URL = 'https://api.binance.com';

module.exports = {
	name: 'current',
	description: 'Shows current crypto currency price',
	cooldown: 5,
	help: 'current {trade_in} {trade_out}',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		if (!args[0]) return msg.reply(`enter a crypto pair \`${prefix}current {trade_in} {trade_out}\``);

		const trade_in = args[0].toUpperCase();
		const trade_out = args[1].toUpperCase();
		const pair = `${trade_in}${trade_out}`;

		if (pair.length < 4) pair += 'BTC';

		try {
			const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
			const symbol_price = ticker.filter((t) => t.symbol === pair);
			if (!symbol_price.length) return msg.reply(`pair \`${pair}\` does not exist`);

			const pair_info = symbol_price[0];

			const { data: change_price_24 } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/24hr`);
			const change_price = change_price_24.filter((t) => t.symbol === pair)[0];

			const currentPriceEmbed = new Discord.MessageEmbed()
				.setColor('#e3c500')
				.setAuthor(
					`${pair} current price`,
					'https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0028/4238/imagen-bitcoin.png?1508147409'
				)
				.setThumbnail(
					'https://public.bnbstatic.com/image/cms/blog/20190405/eb2349c3-b2f8-4a93-a286-8f86a62ea9d8.png'
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
						value: `${getPlusMinusSymbol(change_price.priceChange)}${fixedPrice(change_price.priceChange)}`,
						inline: true,
					}
				)
				.setTimestamp();

			msg.channel.send(currentPriceEmbed);
		} catch (err) {
			console.error(err.message);
		}
	},
};
