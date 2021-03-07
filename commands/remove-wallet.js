const walletsController = require('../controller/wallets');
const guildsController = require('../controller/guilds');

module.exports = {
	name: 'remove-wallet',
	description: 'Remove a wallet to server',
	aliases: ['rw'],
	help: 'remove-wallet {wallet/name}',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		if (!args[0]) return msg.reply(`use correct format \`${prefix}remove-wallet {wallet/name}\``);

		const wallet = args[0];

		try {
			await walletsController.removeWallet(msg.guild.id, wallet);

			const embed = new Discord.MessageEmbed().setColor('#ff2222').setTitle('💼 Wallet removed');

			msg.channel.send(embed);
		} catch (err) {
			if (err.message.includes('found')) return msg.reply(err.message);
			throw err;
		}
	},
};
