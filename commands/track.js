const { default: axios } = require('axios');
const cryptoController = require('../controller/coins');
const guildsController = require('../controller/guilds');

const API_BINANCE_URL = 'https://api.binance.com';

module.exports = {
	name: 'track',
	description: 'Add a coin pair for tracking',
	permissions: ['ADMINISTRATOR'],
	help: '!track {pair} {percentage} [time_interval]',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await guildsController.getPrefix(msg.channel.guild.id)) || '$';
		const premium = await guildsController.getPremium(msg.channel.guild.id);
		const pair_trackeds = await cryptoController.listCoins(msg.channel.guild.id);

		if (!premium) {
			if (pair_trackeds.length === 3)
				return msg.reply(`you are tracking 3 coins already. Check \`${prefix}premium\` benefits.`);
			if (args.length !== 2) return msg.reply(`use correct format \`${prefix}track {pair} {percentage}\``);
		} else {
			if (args.length < 2 || args.length > 3)
				return msg.reply(`use correct format \`${prefix}track {pair} {percentage} [time_interval]\``);

			if (isNaN(args[1]) || (args[2] && isNaN(args[2])))
				return msg.reply(
					`enter a real number in numeric parameters \`${prefix}track {pair} {percentage} [time_interval]\``
				);
		}

		const channel = await guildsController.getChannel(msg.channel.guild.id);
		if (!channel) return msg.reply(`configure a notification channel first \`${prefix}set-channel {channel}\``);

		const pair = args[0].toUpperCase();
		const percentage = args[1];
		const interval = args[2] || 5;

		// CHECK IF PAIR EXISTS
		try {
			const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
			const symbol_price = ticker.filter((t) => t.symbol === pair);
			if (!symbol_price.length) return msg.reply(`pair \`${pair}\` does not exist`);
		} catch (err) {
			throw err;
		}

		// ADD PAIR TO DATABASE
		try {
			await cryptoController.addCoin(msg.channel.guild.id, pair, percentage, interval);

			const embed = new Discord.MessageEmbed()
				.setTitle(':coin: Tracking pair')
				.setColor('#55ff44')
				.setDescription(`You will receive notifications when \nthe coin changes percentage specified`)
				.addFields(
					{ name: 'Pair', value: `${pair.toUpperCase()}`, inline: true },
					{ name: '%', value: `${percentage}%`, inline: true }
				);

			return msg.channel.send(embed);
		} catch (err) {
			if (err.message.includes('pair already')) return msg.reply(err.message);
			if (err.message.includes('tracking 3 coins')) return msg.reply(err.message);
			throw err;
		}
	},
};
