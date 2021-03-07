const { default: axios } = require('axios');
const walletsController = require('../controller/wallets');
const guildsController = require('../controller/guilds');

const API_BINANCE_URL = 'https://api.binance.com';
const ETHERMINE_URL = 'https://api.ethermine.org';

const formatHashrate = (value) => {
	return (value / 1000000).toFixed(4);
};

module.exports = {
	name: 'ethermine',
	description: 'Send ethermine worker information',
	cron: '*/60 * * * *',
	execute: async (client, Discord) => {
		const guilds = await guildsController.getGuilds();

		try {
			guilds.forEach(async (guild_id) => {
				const wallet = await walletsController.getEthermineWallet(guild_id);
				const channel_id = await guildsController.getEthermineChannel(guild_id);

				if (!wallet) return;
				if (!channel_id) return;

				const channel = await client.channels.cache.get(channel_id);

				const payout = await axios.get(`${ETHERMINE_URL}/miner/${wallet}/payouts`);
				const current = await axios.get(`${ETHERMINE_URL}/miner/${wallet}/currentStats`);
				const settings = await axios.get(`${ETHERMINE_URL}/miner/${wallet}/settings`);

				const { data: ticker } = await axios.get(`${API_BINANCE_URL}/api/v3/ticker/price`);
				const symbol_price = ticker.filter((t) => t.symbol === 'ETHEUR');

				const min_payout = settings.data.data.minPayout;
				const eth = (current.data.data.unpaid / min_payout / 10).toFixed(6);
				const reported_hashrate = current.data.data.reportedHashrate;
				const current_hashrate = current.data.data.currentHashrate;
				const avg_hashrate = current.data.data.averageHashrate;
				const eth_per_min = current.data.data.coinsPerMin;
				const eth_per_day = eth_per_min * 60 * 24;
				const last_date_payout = await walletsController.getLastPayout(guild_id);

				if (payout.data.data.length && payout.data.data[0].paidOn !== last_date_payout) {
					const last_payout = payout.data.data[0];
					await walletsController.saveLastPayout(guild_id, last_payout.paidOn);

					const embed = new Discord.MessageEmbed()
						.setAuthor(
							'Payout done!',
							'https://pngimg.com/uploads/coin/coin_PNG36871.png',
							`https://ethermine.org/miners/${wallet}/payouts`
						)
						.setColor('#cf8d00')
						.addFields(
							{
								name: ':coin: Paid Amount',
								value: `${last_payout.amount / min_payout / 10} ETH`,
								inline: true,
							},
							{
								name: '\u200B',
								value: '\u200B',
								inline: true,
							},
							{
								name: '📅 Date',
								value: `${new Date(last_payout.paidOn).toLocaleDateString()}`,
								inline: true,
							},
							{
								name: '💥 TX Hash',
								value: `${last_payout.txHash}`,
							},
							{
								name: '💼 Wallet',
								value: `${wallet}`,
							}
						);

					channel.send('@everyone', { embed: embed });
				}

				const timestamp = new Date().getTime();
				await axios.get(
					`https://web-shot-crypto.herokuapp.com/ethermine-shot?url=https://ethermine.org/miners/${wallet}/dashboard&timestamp=${timestamp}`
				);

				const embed = new Discord.MessageEmbed()
					.setAuthor(
						'Ethermine data',
						'https://lh3.googleusercontent.com/r3HSSxwyYab0H2M5PgUSSIPIKJx-0XyhfiMqHOMFtQRnn3GENwDxhEUOvcAmgJbnZQ=s180',
						'https://ethermine.org/miners/51132fb89d34d969eb4e9be7d140b92f305f32b5/dashboard'
					)
					.setColor('#cf8d00')
					.setImage(`https://web-shot-crypto.herokuapp.com/image.png?timestamp=${timestamp}`)
					.addFields(
						{ name: ':coin: ETH', value: `${eth} ETH (${Math.floor((eth / 0.1) * 100)}%)`, inline: true },
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: '📅 ETH daily',
							value: `${eth_per_day.toFixed(6)} ETH`,
							inline: true,
						},
						{
							name: ':dollar: EUR',
							value: `${(eth * parseFloat(symbol_price[0].price)).toFixed(2)} €`,
							inline: true,
						},
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: '💶 EUR daily',
							value: `${(eth_per_day * parseFloat(symbol_price[0].price)).toFixed(2)} €`,
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
							inline: true,
						}
					);

				channel.send(embed);
			});
		} catch (err) {
			console.log(err.message);
		}
	},
};
