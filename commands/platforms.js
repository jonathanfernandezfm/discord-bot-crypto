module.exports = {
	name: 'platforms',
	description: 'List available platforms',
	premissions: ['ADMINISTRATOR'],
	help: 'platforms',
	execute: async (msg, args, client, Discord) => {
		const embed = new Discord.MessageEmbed()
			.setTitle(`🌎 Available platforms`)
			.setDescription(
				`\`Binance\`
                \`Coinbase\`
                \`More coming soon...\``
			)
			.setColor('#ffff55');

		msg.channel.send(embed);
	},
};
