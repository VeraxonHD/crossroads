const { SlashCommandBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const Configs = require("../../models/configs").getModel();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modmail')
		.setDescription('Opens the modmail window for this server.')
        .setDMPermission(false),
	async execute(interaction) {
        const config = await Configs.findOne({where: {guildId: interaction.guildId}});
        if(config.modmailEnabled){
            const modal = new ModalBuilder()
                .setCustomId("modmailModal")
                .setTitle("Create new Modmail Ticket");

            const titleElement = new TextInputBuilder()
                .setCustomId("titleElement")
                .setLabel("Short Description (Title)")
                .setRequired(true)
                .setMaxLength(100)
                .setStyle(TextInputStyle.Short);
            
            const descriptionElement = new TextInputBuilder()
                .setCustomId("descriptionElement")
                .setLabel("Detailed description (Paragraph)")
                .setRequired(true)
                .setMaxLength(1000)
                .setStyle(TextInputStyle.Paragraph);

            const titleRow = new ActionRowBuilder()
                .addComponents(titleElement);

            const descriptionRow = new ActionRowBuilder()
                .addComponents(descriptionElement);
            
            modal.addComponents(titleRow, descriptionRow);

            await interaction.showModal(modal);
        }else{
            interaction.reply({content: `Modmail is not enabled on this server. Please contact staff directly.`, ephemeral: true});
        }
	},
};
