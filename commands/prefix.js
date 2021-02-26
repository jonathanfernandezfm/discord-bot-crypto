const guildsController = require('../controller/guilds');

module.exports = {
	name: 'prefix',
	description: 'Change bot prefix',
	permissions: ['ADMINISTRATOR'],
	help: 'prefix',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await guildsController.getPrefix(msg.channel.guild.id)) || '$';
		if (args.length !== 1) return msg.reply(`use correct format ${prefix}prefix {prefix}`);

		const new_prefix = args[0];
		await guildsController.setPrefix(msg.channel.guild.id, new_prefix);

		const embed = new Discord.MessageEmbed().setTitle(`✏ Prefix changed to \`${new_prefix}\``).setColor('#44ff44');

		return msg.channel.send(embed);
	},
};
