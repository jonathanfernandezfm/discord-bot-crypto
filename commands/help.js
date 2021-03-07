const guildsController = require('../controller/guilds');
const { capitalize } = require('../utils/utils');

module.exports = {
	name: 'help',
	description: 'Help',
	aliases: ['info', 'server'],
	help: 'help',
	execute: async (msg, args, client, Discord) => {
		const prefix = await guildsController.getPrefix(msg.channel.guild.id);
		const premium = await guildsController.getPremium(msg.channel.guild.id);
		const platform = await guildsController.getDefaultPlatform(msg.channel.guild.id);

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
							value: `\`${prefix}track {trade_in} {trade_out} {percentage}\`
                                        \`${prefix}remove {trade_in} {trade_out}\`
                                        \`${prefix}modify {trade_in} {trade_out} {percentage}\`
                                        \`${prefix}set-channel {channel}\`
                                        \`${prefix}remove-channel\``,
							inline: true,
						});

					return msg.channel.send(trackingEmbed);
				case 'current':
					const currentEmbed = new Discord.MessageEmbed()
						.setTitle('Current prices')
						.setColor('#ffdd55')
						.setDescription(
							'This section shows commands to manage cryptocurrencies and track current prices'
						)
						.addFields({
							name: 'Commands',
							value: `\`${prefix}current {trade_in} {trade_out}\`
					            \`${prefix}pairs {search}\``,
							inline: true,
						});

					return msg.channel.send(currentEmbed);
				case 'config':
					const configEmbed = new Discord.MessageEmbed()
						.setTitle('Configurating the bot')
						.setColor('#ffdd55')
						.setDescription('This section shows commands to configure the bot or misc commands')
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
				default:
					return msg.reply('this section does not exist');
			}

		const embed = new Discord.MessageEmbed()
			.setTitle('Server information')
			.setAuthor('Welcome to Crypto Alerts!', client.user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setColor('#ffdd55')
			.addFields(
				{ name: 'Prefix', value: prefix, inline: true },
				{ name: 'Premium', value: premium ? '✅' : '❌', inline: true },
				{ name: 'Platform', value: capitalize(platform) },
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
