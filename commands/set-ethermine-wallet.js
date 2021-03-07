const guildsController = require('../controller/guilds');
const walletsController = require('../controller/wallets');

module.exports = {
	name: 'set-ethermine-wallet',
	description: 'Set ethermine wallet for notifications',
	aliases: ['sew'],
	help: 'set-ethermine-wallet',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		if (args.length !== 1) return msg.reply(`use correct format \`${prefix}set-ethermine-wallet {wallet/name}\``);

		const wallet = args[0];

		try {
			await walletsController.setEthermineWallet(msg.guild.id, wallet);

			const embed = new Discord.MessageEmbed().setColor('#55ff44').setTitle('⛏ Ethermine wallet added');

			msg.channel.send(embed);
		} catch (err) {
			if (err.message.includes('exist')) return msg.reply(err.message);
			throw err;
		}
	},
};
