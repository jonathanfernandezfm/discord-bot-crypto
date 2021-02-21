const serverController = require('../controller/server');

module.exports = {
	name: 'help',
	description: 'Help',
	aliases: ['info'],
	help: 'help',
	execute: async (msg, args, client, Discord) => {
		const prefix = (await serverController.getPrefix(msg.channel.guild.id)) || '!';

		const section = args[0];

		if (section)
			switch (section) {
				case 'tracking':
					const trackingEmbed = new Discord.MessageEmbed()
						.setTitle('Tracking cryptocurrencies')
						.setColor('#ffdd55')
						.setDescription(
							'This section shows commands to manage cryptocurrencies and track when these go up or down an specified percentage since last notification'
						)
						.addFields({
							name: 'Commands',
							value: `\`${prefix}track {pair} {percentage}\`
                                        \`${prefix}remove {pair}\`
                                        \`${prefix}modify {pair} {percentage}\`
                                        \`${prefix}set-channel {channel}\`
                                        \`${prefix}remove-channel\``,
							inline: true,
						});

					return msg.channel.send(trackingEmbed);
					break;
				case 'current':
					const currentEmbed = new Discord.MessageEmbed()
						.setTitle('Current prices')
						.setColor('#ffdd55')
						.setDescription(
							'This section shows commands to manage cryptocurrencies and track current prices'
						)
						.addFields({
							name: 'Commands',
							value: `\`${prefix}current {pair}\`
					            \`${prefix}pairs {search}\``,
							inline: true,
						});

					return msg.channel.send(currentEmbed);
					break;
				case 'config':
					const configEmbed = new Discord.MessageEmbed()
						.setTitle('Configurating the bot')
						.setColor('#ffdd55')
						.setDescription(
							'This section shows commands to configure the bot or misc commands'
						)
						.addFields({
							name: 'Commands',
							value: `\`${prefix}help\` or \`${prefix}info\` or \`@bot\`
                                        \`${prefix}help {section}\` or \`${prefix}info {section}\`
                                        \`${prefix}prefix {prefix}\`
                                        \`${prefix}clear {number}\`
                                        \`${prefix}ping\``,
							inline: true,
						});

					return msg.channel.send(configEmbed);
					break;
				default:
					return msg.reply('this section does not exist');
					break;
			}

		const embed = new Discord.MessageEmbed()
			.setTitle('Server information')
			.setAuthor(
				'Welcome to Crypto Alerts!',
				client.user.displayAvatarURL({ format: 'png', dynamic: true })
			)
			.setColor('#ffdd55')
			.addFields(
				{ name: 'Prefix', value: prefix },
				{ name: 'Platform', value: 'Binance (WIP more)' },
				{
					name: 'Track changes',
					value: `\`${prefix}help tracking\``,
					inline: true,
				},
				{
					name: 'Current prices',
					value: `\`${prefix}help current\``,
					inline: true,
				},
				{
					name: 'Bot configuration',
					value: `\`${prefix}help config\``,
					inline: true,
				}
			);

		msg.channel.send(embed);
	},
};
