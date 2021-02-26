module.exports = {
	name: 'premium',
	description: 'Information about premium',
	cooldown: 5,
	help: 'premium ',
	execute: async (msg, args, client, Discord) => {
		const embed = new Discord.MessageEmbed()
			.setColor('#fc0394')
			.setAuthor('⭐ Premium information')
			.setDescription('Premium members have more functionalities and platforms')
			.addFields(
				{
					name: 'List of benefits',
					value: `\`More than 3 tracking coin notifications\`
                            \`More than 3 current price notifications\`
                            \`Modify notification times\`
                            \`Use more platforms and change default:\`
                            -- \`Coinbase\`
                            -- \`KuCoin\`
                            -- \`More coming...\``,
				},
				{
					name: 'Contact',
					value: `Please contact (DM) <@${client.user.id}> for more information`,
					inline: true,
				}
			);

		msg.channel.send(embed);
	},
};
