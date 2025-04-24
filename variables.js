const commands = [
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

export { commands };
