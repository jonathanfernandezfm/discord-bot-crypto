const guildsController = require('../controller/guilds');

module.exports = {
	name: 'set-channel',
	description: 'Set channel for notifications',
	permissions: ['ADMINISTRATOR'],
	help: 'set-channel',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await guildsController.getPrefix(msg.channel.guild.id)) || '$';
		if (args.length !== 1) return msg.reply(`use correct format \`${prefix}set-channel {channel}\``);

		let target = args[0];
		if (args[0].includes('<#')) target = args[0].substring(args[0].indexOf('#') + 1, args[0].indexOf('>'));

		await guildsController.addNotificationChannel(msg.channel.guild.id, target);
		const channel = msg.channel.guild.channels.cache.get(target);

		const embed = new Discord.MessageEmbed()
			.setTitle('💬 Channel configured')
			.setColor('#55ff44')
			.setDescription(`You will receive notifications in ${channel}`);

		return msg.channel.send(embed);
	},
};
