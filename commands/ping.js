module.exports = {
	name: 'ping',
	description: 'Bot responds with a pong',
	aliases: ['pingi'],
	cooldown: 10,
	help: '!ping',
	execute: (msg, args, client, Discord) => {
		msg.channel.send('🏓 **Pong**');
	},
};
