module.exports = {
	name: 'clear',
	description: 'Clear messages',
	cooldown: 5,
	permissions: ['ADMINISTRATOR'],
	help: 'clear {number}',
	execute: async (msg, args, client, Discord) => {
		if (!args[0]) return msg.reply('enter an amount of messages');
		if (isNaN(args[0])) return msg.reply('enter a real number');

		if (args[0] < 1 || args[0] > 100) return msg.reply('provide a number between 1 and 100');

		await msg.channel.messages.fetch({ limit: args[0] }).then((messages) => {
			msg.channel.bulkDelete(messages);
		});
	},
};
