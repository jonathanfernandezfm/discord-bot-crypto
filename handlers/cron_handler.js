const fs = require('fs');
const nodecron = require('node-cron');

module.exports = (client, Discord) => {
	const cron_files = fs.readdirSync('./crons/').filter((file) => file.endsWith('.js'));

	for (const file of cron_files) {
		const cron = require(`../crons/${file}`);

		if (cron.name)
			nodecron.schedule(cron.cron, () => {
				cron.execute(client, Discord);
			});
	}
};
