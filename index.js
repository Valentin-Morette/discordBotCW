import { EmbedBuilder, AttachmentBuilder, Client, GatewayIntentBits } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

function capitalize(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function compare(a, b) {
	if (a[1].score < b[1].score) return 1;
	if (a[1].score > b[1].score) return -1;
	return 0;
}

function slashCommande(commands) {
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	(async () => {
		try {
			console.log('Starting slash commands registration.');

			await rest.put(Routes.applicationCommands(process.env.IDAPPLICATION), {
				body: commands,
			});

			console.log('Slash commands registered successfully!');
		} catch (error) {
			console.error(error);
		}
	})();
}

const commandsCwStats = [
	{
		name: 'stats',
		description: 'Displays the Codewars user stats',
		options: [
			{
				name: 'username',
				type: 3,
				description: 'Codewars username',
				required: true,
			},
		],
	},
];

slashCommande(commandsCwStats);

const clientCw = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

clientCw.on('ready', () => {
	console.log(`Bot CW Ready!`);
});

clientCw.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		if (interaction.commandName === 'stats') {
			let username = interaction.options.getString('username');
			let url = `https://www.codewars.com/api/v1/users/${username}`;

			async function fetchUser() {
				try {
					const response = await axios.get(url);
					const data = response.data;
					let arr = [];

					for (const [key, value] of Object.entries(data.ranks.languages)) {
						arr.push([key, value]);
					}
					arr.sort(compare);

					const attachment = new AttachmentBuilder(`./cw.png`);

					const embed = new EmbedBuilder()
						.setColor('#B43622')
						.setTitle(`Stats of ${username}`)
						.setThumbnail('attachment://cw.png')
						.addFields(
							{ name: 'Rank', value: data.ranks.overall.name, inline: true },
							{
								name: 'Katas',
								value: data.codeChallenges.totalCompleted.toString(),
								inline: true,
							},
							{ name: 'Honor', value: data.honor.toString(), inline: true },
							{ name: 'Total Score', value: data.ranks.overall.score.toString(), inline: true }
						);

					let scoreString = '';
					arr.forEach((item) => {
						scoreString += `${capitalize(item[0])}: ${item[1].score}\n`;
					});
					embed.addFields({ name: 'Score per Language', value: scoreString });

					embed.addFields({
						name: 'Global Ranking',
						value: data.leaderboardPosition ? `${data.leaderboardPosition}th` : 'No ranking',
					});

					interaction.reply({ embeds: [embed], files: [attachment] });
				} catch (error) {
					interaction.reply(`The user ${username} does not exist`);
				}
			}

			fetchUser();
		}
	}
});

clientCw.login(process.env.TOKEN);
