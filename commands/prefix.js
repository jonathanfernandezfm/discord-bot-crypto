const serverController = require('../controller/server');

module.exports = {
	name: 'prefix',
	description: 'Change bot prefix',
	help: '!prefix',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await serverController.getPrefix(msg.channel.guild.id)) || '!';
		if (args.length !== 1) return msg.reply(`use correct format ${prefix}prefix {prefix}`);

		const new_prefix = args[0];
		await serverController.setPrefix(msg.channel.guild.id, new_prefix);

		const embed = new Discord.MessageEmbed()
			.setTitle(`✏ Prefix changed to \`${new_prefix}\``)
			.setColor('#44ff44');

		return msg.channel.send(embed);
	},
};
