const guildsController = require('../../controller/guilds');

const validPermissions = [
	'CREATE_INSTANT_INVITE',
	'KICK_MEMBERS',
	'BAN_MEMBERS',
	'ADMINISTRATOR',
	'MANAGE_CHANNELS',
	'MANAGE_GUILD',
	'ADD_REACTIONS',
	'VIEW_AUDIT_LOG',
	'PRIORITY_SPEAKER',
	'STREAM',
	'VIEW_CHANNEL',
	'SEND_MESSAGES',
	'SEND_TTS_MESSAGES',
	'MANAGE_MESSAGES',
	'EMBED_LINKS',
	'ATTACH_FILES',
	'READ_MESSAGE_HISTORY',
	'MENTION_EVERYONE',
	'USE_EXTERNAL_EMOJIS',
	'VIEW_GUILD_INSIGHTS',
	'CONNECT',
	'SPEAK',
	'MUTE_MEMBERS',
	'DEAFEN_MEMBERS',
	'MOVE_MEMBERS',
	'USE_VAD',
	'CHANGE_NICKNAME',
	'MANAGE_NICKNAMES',
	'MANAGE_ROLES',
	'MANAGE_WEBHOOKS',
	'MANAGE_EMOJIS',
];

const cooldowns = new Map();

module.exports = async (Discord, client, message) => {
	const prefix = await guildsController.getPrefix(message.channel.guild.id);

	//////////// MENTION BOT HELP ////////////

	const mention = message.mentions.members.first();
	if (mention && client.user.id === mention.id)
		return client.commands.get('help').execute(message, [], client, Discord);

	//////////// PREFIX ////////////

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command =
		client.commands.get(cmd) || client.commands.find((command) => command.aliases && command.aliases.includes(cmd));

	if (!command) return;

	//////////// WIP ////////////

	if (command.wip) return message.reply('this command is still WIP. Coming soon');

	//////////// PERMISSIONS ////////////

	if (command.permissions) {
		for (const perm of command.permissions) {
			if (!validPermissions.includes(perm)) {
				return console.log(`Invalid permissions ${perm}`);
			}
			if (!message.member.hasPermission(perm)) {
				return message.reply(`you don't have enough permissions`);
			}
		}
	}

	/////////////////////////////////////

	//////////// COOLDOWN ////////////

	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

	const currentTime = Date.now();
	const timeStamps = cooldowns.get(command.name);
	const cooldownAmount = command.cooldown * 1000;

	if (timeStamps.has(message.author.id)) {
		const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;

		if (currentTime < expirationTime) {
			const timeLeft = (expirationTime - currentTime) / 1000;

			return message.reply(`Wait ${timeLeft.toFixed(1)} seconds before using command \`${command.name}\` again`);
		}
	}

	timeStamps.set(message.author.id, currentTime);
	setTimeout(() => timeStamps.delete(message.author.id), cooldownAmount);

	//////////////////////////////////

	try {
		await command.execute(message, args, client, Discord);
	} catch (err) {
		message.reply('there was an error executing this command. 😫');
		console.log(err);
	}
};
