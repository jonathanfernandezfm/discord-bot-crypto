const guildsController = require('../controller/guilds');

const platforms = ['binance', 'coinbase'];

module.exports = {
	name: 'platform',
	description: 'Changes platform for server',
	permissions: ['ADMINISTRATOR'],
	wip: true,
	help: 'platform {platform}',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		if (!args[0]) return msg.reply(`use correct format \`${prefix}platform {platform}\``);
		if (!platforms.includes(args[0].toLowerCase()))
			return msg.reply(`unknow platform. Check \`${prefix}platforms\` for available platforms`);

		const platform = capitalize(platforms[platforms.indexOf(args[0].toLowerCase())]);
		await guildsController.setDefaultPlatform(msg.channel.guild.id, args[0]);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffff55')
			.setTitle(`🌎 Default platform changed to \`${platform}\``);

		msg.channel.send(embed);
	},
};
