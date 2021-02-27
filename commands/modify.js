const { default: axios } = require('axios');
const cryptoController = require('../controller/coins');
const guildsController = require('../controller/guilds');

const API_BINANCE_URL = 'https://api.binance.com';

module.exports = {
	name: 'modify',
	description: 'Modify a coin pair percentage',
	cooldown: 5,
	permissions: ['ADMINISTRATOR'],
	help: 'modify {trade_in} {trade_out} {percentage}',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await guildsController.getPrefix(msg.channel.guild.id)) || '$';
		if (args.length !== 3)
			return msg.reply(`use correct format \`${prefix}modify {trade_in} {trade_out} {percentage}\``);
		if (isNaN(args[2]))
			return msg.reply(
				`enter a real number as percentage \`${prefix}modify {trade_in} {trade_out} {percentage}\``
			);

		const channel = await guildsController.getChannel(msg.channel.guild.id);
		if (!channel) return msg.reply(`configure a notification channel first \`${prefix}set-channel {channel}\``);

		const trade_in = args[0].toUpperCase();
		const trade_out = args[1].toUpperCase();
		const pair = `${trade_in}${trade_out}`;
		const percentage = args[2];

		// CHECK IF PAIR EXISTS
		try {
			const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
			const symbol_price = ticker.filter((t) => t.symbol === pair);
			if (!symbol_price.length) return msg.reply(`pair \`${pair}\` does not exist`);
		} catch (err) {
			throw err;
		}

		// MODIFY PAIR IN DATABASE
		try {
			await cryptoController.editCoin(msg.channel.guild.id, trade_in, trade_out, percentage);

			const embed = new Discord.MessageEmbed()
				.setTitle(':coin: Succesfully modified pair')
				.setColor('#55ff44')
				.addFields(
					{ name: 'Pair', value: `${pair.toUpperCase()}`, inline: true },
					{ name: '%', value: `${percentage}%`, inline: true }
				);

			return msg.channel.send(embed);
		} catch (err) {
			if (err.message.includes('pair is not being tracked')) return msg.reply(err.message);
			throw err;
		}
	},
};
