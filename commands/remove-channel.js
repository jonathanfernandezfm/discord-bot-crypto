const channelsController = require('../controller/guilds');

module.exports = {
	name: 'remove-channel',
	description: 'Removes channel for notifications',
	permissions: ['ADMINISTRATOR'],
	help: 'remove-channel',
	execute: async (msg, args, client, Discord) => {
		await channelsController.removeNotificationChannel(msg.channel.guild.id);

		const embed = new Discord.MessageEmbed()
			.setTitle('💬 Channel removed')
			.setColor('#ff2222')
			.setDescription(`You will no longer receive notifications`);

		return msg.channel.send(embed);
	},
};
