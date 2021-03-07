const walletsController = require('../controller/wallets');
const guildsController = require('../controller/guilds');

module.exports = {
	name: 'add-wallet',
	description: 'Add a wallet to server',
	aliases: ['aw'],
	help: 'add-wallet {wallet} [name]',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		if (!args[0]) return msg.reply(`use correct format \`${prefix}add-wallet {wallet} [name]\``);

		const wallet = args[0];
		const name = args[1];

		try {
			await walletsController.addWallet(msg.guild.id, wallet, name);

			const embed = new Discord.MessageEmbed()
				.setColor('#55ff44')
				.setTitle('💼 Wallet added')
				.addFields(
					{ name: 'Name', value: `${name}`, inline: true },
					{ name: '💼', value: `${wallet}`, inline: true }
				);

			msg.channel.send(embed);
		} catch (err) {
			if (err.message.includes('exist')) return msg.reply(err.message);
			throw err;
		}
	},
};
