import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

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

			// await rest.put(Routes.applicationGuildCommands(process.env.IDAPPLICATION, process.env.IDSERVER), {
			// 	body: commands,
			// });

			await rest.put(Routes.applicationCommands(process.env.IDAPPLICATION), {
				body: commands,
			});

			console.log('Slash commands registered successfully!');
		} catch (error) {
			console.error(error);
		}
	})();
}

export { slashCommande, compare, capitalize };
