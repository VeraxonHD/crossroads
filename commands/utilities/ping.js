const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check latency and responsiveness.'),
	async execute(interaction) {
        var startTime = Date.now();
		await interaction.reply('Pong!').then(msg => {
            var endTime = Date.now();
            msg.edit(`Pong! Message edit benchmark: \`${endTime-startTime}\`ms`);
        });
	},
};
