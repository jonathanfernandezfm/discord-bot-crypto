const walletsController = require('../controller/wallets');
const guildsController = require('../controller/guilds');

module.exports = {
	name: 'list-wallets',
	description: 'List wallets from server',
	aliases: ['lw'],
	help: 'list-wallets',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);

		try {
			const wallets = await walletsController.listWallets(msg.guild.id);

			if (wallets && wallets.length !== 0) {
				let name_string = '';
				let wallet_string = '';

				wallets.forEach((w) => {
					name_string += `${w.name}\n`;
					wallet_string += `${w.wallet}\n`;
				});

				const embed = new Discord.MessageEmbed()
					.setTitle('💼 Wallets')
					.setColor('#ffff55')
					.addFields(
						{ name: 'Name', value: `${name_string}`, inline: true },
						{ name: '💼', value: `${wallet_string}`, inline: true }
					);

				return msg.channel.send(embed);
			} else {
				const embed = new Discord.MessageEmbed()
					.setTitle('💼 Wallets')
					.setColor('#ffff55')
					.setDescription(`No wallets added. Use ${prefix}add-wallet`);

				return msg.channel.send(embed);
			}
		} catch (err) {
			throw err;
		}

		const embed = new Discord.MessageEmbed().setColor('#fc0394').setTitle('🌟 Premium server added');

		msg.channel.send(embed);
	},
};
