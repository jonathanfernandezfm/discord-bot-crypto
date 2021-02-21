const { default: axios } = require('axios');
const serverController = require('../controller/server');

const API_BINANCE_URL = 'https://api.binance.com';

module.exports = {
	name: 'pairs',
	description: 'Shows current crypto currency price',
	cooldown: 5,
	help: 'pairs {search}',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await serverController.getPrefix(msg.channel.guild.id)) || '!';
		if (!args[0]) return msg.reply(`enter a search \`${prefix}pairs {search}\``);
		const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);

		let symbol_string = '';
		const search = args[0].toUpperCase();

		ticker.forEach(({ symbol, price }) => {
			if (symbol.startsWith(search)) symbol_string += `\`${symbol}\` `;
		});

		if (symbol_string.length > 1024)
			return msg.reply('be more specific. The search returned too much pairs');

		if (symbol_string === '') return msg.reply(`search \`${search}\` found nothing`);

		const embed = new Discord.MessageEmbed()
			.setTitle('Pairs available')
			.setColor('#ffdd55')
			.addFields({ name: 'Result', value: symbol_string });

		msg.channel.send(embed);
	},
};
