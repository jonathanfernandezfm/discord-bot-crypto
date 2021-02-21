const cryptoController = require('../controller/coins');
const channelController = require('../controller/guilds');
const serverController = require('../controller/server');

module.exports = {
	name: 'remove',
	description: 'Remove a coin pair that is being tracked',
	permissions: ['ADMINISTRATOR'],
	help: 'remove {pair}',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await serverController.getPrefix(msg.channel.guild.id)) || '$';
		if (args.length !== 1) return msg.reply(`use correct format \`${prefix}remove {pair}\``);

		const channel = await channelController.getChannel(msg.channel.guild.id);
		if (!channel)
			return msg.reply(
				`configure a notification channel first \`${prefix}set-channel {channel}\``
			);

		const pair = args[0].toUpperCase();

		// REMOVE PAIR FROM DATABASE
		try {
			await cryptoController.removeCoin(msg.channel.guild.id, pair);

			const embed = new Discord.MessageEmbed()
				.setTitle(':coin: Pair removed')
				.setColor('#ff2222')
				.addFields({ name: 'Pair', value: `${pair.toUpperCase()}`, inline: true });

			return msg.channel.send(embed);
		} catch (err) {
			if (err.message.includes('pair is not being tracked')) return msg.reply(err.message);
			throw err;
		}
	},
};
