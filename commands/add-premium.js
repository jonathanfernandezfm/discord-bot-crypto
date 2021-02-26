const guildsController = require('../controller/guilds');

module.exports = {
	name: 'add-premium',
	description: 'Add premium to a server',
	premissions: ['ADMINISTRATOR'],
	help: 'add-premium {server}',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		if (msg.author.id !== process.env.CREATOR) return;
		if (!args[0]) return msg.reply(`use correct format \`${prefix}add-premium {server}\``);

		try {
			await guildsController.setPremium(args[0]);
		} catch (err) {
			if (err.message.includes('exist')) return msg.reply(err.message);
			throw err;
		}

		const embed = new Discord.MessageEmbed().setColor('#fc0394').setTitle('🌟 Premium server added');

		msg.channel.send(embed);
	},
};
