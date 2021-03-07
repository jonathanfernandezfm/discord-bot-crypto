const { default: axios } = require('axios');
const cryptoController = require('../controller/coins');
const pricesController = require('../controller/prices');
const guildsController = require('../controller/guilds');
const { getPlusMinusSymbol, fixedPrice, capitalize } = require('../utils/utils');

const API_BINANCE_URL = 'https://api.binance.com';

const formatting = {
	down: {
		color: '#ff4444',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Eo_circle_red_arrow-down.svg/30px-Eo_circle_red_arrow-down.svg.png',
	},

	up: {
		color: '#66ff66',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Eo_circle_green_arrow-up.svg/30px-Eo_circle_green_arrow-up.svg.png',
	},
};

const platforms = {
	binance: {
		image: 'https://public.bnbstatic.com/image/cms/blog/20200707/631c823b-886e-4e46-b12f-29e5fdc0882e.png',
	},
};

const getSymbolImage = async (symbol) => {
	try {
		const coin = symbol.slice(0, 3).toLowerCase();
		await axios.get(`https://cryptoicons.org/api/color/${coin}/50`);
		return `https://cryptoicons.org/api/color/${coin}/50`;
	} catch (err) {
		return 'https://images.vexels.com/media/users/3/152864/isolated/preview/2e095de08301a57890aad6898ad8ba4c-yellow-circle-question-mark-icon-by-vexels.png';
	}
};

module.exports = {
	name: 'tracking-changes',
	description: 'Send change notifications of tracked crypto pairs',
	cron: '*/5 * * * *',
	execute: async (client, Discord) => {
		const guilds = await guildsController.getGuilds();

		try {
			guilds.forEach(async (guild_id) => {
				const guild = client.guilds.cache.get(guild_id);
				const channel_id = await guildsController.getChannel(guild_id);
				const platform = await guildsController.getDefaultPlatform(guild_id);
				const pairs = await cryptoController.listCoins(guild_id);
				if (!guild || !channel_id || !pairs) return;

				const channel = guild.channels.cache.get(channel_id);

				pairs.forEach(async ({ trade_in, trade_out, percentage }) => {
					const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
					const pair = `${trade_in}${trade_out}`;
					const { symbol, price } = ticker.filter((t) => t.symbol === pair)[0];
					let last_price = await pricesController.getPrice(guild_id, trade_in, trade_out);
					if (!last_price) last_price = await pricesController.setPrice(guild_id, trade_in, trade_out, price);

					const perc_change = ((price - last_price) / last_price) * 100;
					const money_change_last_price = price - last_price;

					if (Math.abs(perc_change) > percentage) {
						pricesController.setPrice(guild_id, trade_in, trade_out, price);

						const changePriceEmbed = new Discord.MessageEmbed()
							.setColor(`${perc_change < 0 ? formatting.down.color : formatting.up.color}`)
							.setAuthor(
								`${symbol}`,
								`${await getSymbolImage(symbol)}` //perc_change < 0 ? formatting.down.image : formatting.up.image
							)
							.setThumbnail(perc_change < 0 ? formatting.down.image : formatting.up.image)
							.addFields(
								{ name: 'Coin', value: `${symbol}`, inline: true },
								{
									name: '\u200B',
									value: '\u200B',
									inline: true,
								},
								{
									name: 'Current price',
									value: `${fixedPrice(price)}`,
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
									value: `${fixedPrice(last_price)}`,
									inline: true,
								},
								{
									name: '% Change',
									value: `${getPlusMinusSymbol(perc_change)}${perc_change}%`,
									inline: true,
								}
							)
							.setTimestamp()
							.setFooter(capitalize(platform), platforms.binance.image);

						channel.send(changePriceEmbed);
					}
				});
			});
		} catch (err) {
			console.log(err.message);
		}
	},
};
