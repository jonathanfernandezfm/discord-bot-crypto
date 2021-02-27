const cryptoController = require('../controller/coins');
const guildsController = require('../controller/guilds');

module.exports = {
	name: 'remove',
	description: 'Remove a coin pair that is being tracked',
	permissions: ['ADMINISTRATOR'],
	help: 'remove {trade_in} {trade_out}',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await guildsController.getPrefix(msg.channel.guild.id)) || '$';
		if (args.length !== 2) return msg.reply(`use correct format \`${prefix}remove {trade_in} {trade_out}\``);

		const channel = await guildsController.getChannel(msg.channel.guild.id);
		if (!channel) return msg.reply(`configure a notification channel first \`${prefix}set-channel {channel}\``);

		const trade_in = args[0].toUpperCase();
		const trade_out = args[1].toUpperCase();
		const pair = `${trade_in}${trade_out}`;

		// REMOVE PAIR FROM DATABASE
		try {
			await cryptoController.removeCoin(msg.channel.guild.id, trade_in, trade_out);

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
