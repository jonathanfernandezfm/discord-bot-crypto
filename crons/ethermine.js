const { default: axios } = require('axios');

const API_BINANCE_URL = 'https://api.binance.com';
const WALLET = '51132fb89d34d969eb4e9be7d140b92f305f32b5';

const formatHashrate = (value) => {
	return (value / 1000000).toFixed(4);
};

module.exports = {
	name: 'ethermine',
	description: 'Send ethermine worker information',
	cron: '*/30 * * * *',
	execute: async (client, Discord) => {
		const channel = await client.channels.cache.get('812999448501682176');

		const worker = await axios.get(`https://api.ethermine.org/miner/${WALLET}/dashboard`);

		const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
		const symbol_price = ticker.filter((t) => t.symbol === 'ETHEUR');

		const eth = (worker.data.data.currentStatistics.unpaid / worker.data.data.settings.minPayout / 10).toFixed(6);
		const reported_hashrate = worker.data.data.currentStatistics.reportedHashrate;
		const current_hashrate = worker.data.data.currentStatistics.currentHashrate;
		const statistics = worker.data.data.statistics;

		let sum = 0;
		statistics.forEach((stat) => {
			sum += stat.currentHashrate;
		});
		const avg_hashrate = sum / statistics.length;

		const embed = new Discord.MessageEmbed()
			.setAuthor(
				'Ethermine data',
				'https://lh3.googleusercontent.com/r3HSSxwyYab0H2M5PgUSSIPIKJx-0XyhfiMqHOMFtQRnn3GENwDxhEUOvcAmgJbnZQ=s180'
			)
			.setColor('#cf8d00')
			.setImage(
				`https://web-shot-crypto.herokuapp.com/ethermine-shot.png?url=https://ethermine.org/miners/${WALLET}/dashboard`
			)
			.addFields(
				{ name: ':coin: ETH', value: `${eth} ETH (${Math.floor((eth / 0.1) * 100)}%)`, inline: true },
				{
					name: '\u200B',
					value: '\u200B',
					inline: true,
				},
				{
					name: ':dollar: EUR',
					value: `${(eth * parseFloat(symbol_price[0].price)).toFixed(2)} €`,
					inline: true,
				},
				{
					name: '📈 Reported hashrate',
					value: `${formatHashrate(reported_hashrate)} MH/s`,
					inline: true,
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true,
				},
				{
					name: '📈 Current hashrate',
					value: `${formatHashrate(current_hashrate)} MH/s`,
					inline: true,
				},
				{
					name: '📈 Average hashrate',
					value: `${formatHashrate(avg_hashrate)} MH/s`,
				}
			);

		channel.send(embed);
	},
};
