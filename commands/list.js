const cryptoController = require('../controller/coins');
const guildsController = require('../controller/guilds');

module.exports = {
	name: 'list',
	description: 'List pair being tracked',
	cooldown: 5,
	help: 'list',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await guildsController.getPrefix(msg.channel.guild.id)) || '$';
		const channel = await guildsController.getChannel(msg.channel.guild.id);
		if (!channel) return msg.reply(`configure a notification channel first \`${prefix}set-channel {channel}\``);

		// LIST PAIR FROM DATABASE
		try {
			const pairs = await cryptoController.listCoins(msg.channel.guild.id);
			let pairs_string = '';
			let percetage_string = '';

			if (pairs && pairs.length !== 0) {
				pairs.forEach((p) => {
					pairs_string += `${p.trade_in}${p.trade_out}\n`;
					percetage_string += `${p.percentage}%\n`;
				});

				const embed = new Discord.MessageEmbed()
					.setTitle(':coin: Tracked pairs')
					.setColor('#ffff55')
					.setDescription(`Notification channel\n<#${channel}>`)
					.addFields(
						{ name: 'Pair', value: `${pairs_string}`, inline: true },
						{ name: '%', value: `${percetage_string}`, inline: true }
					);

				return msg.channel.send(embed);
			} else {
				const embed = new Discord.MessageEmbed()
					.setTitle(':coin: Tracked pairs')
					.setColor('#ffff55')
					.setDescription('No pairs are being tracked');

				return msg.channel.send(embed);
			}
		} catch (err) {
			throw err;
		}
	},
};
