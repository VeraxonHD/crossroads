const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Configs = require('../../models/configs').getModel();
const Signups = require('../../models/signups').getModel();
const SignupOptions = require('../../models/signupoptions').getModel();
const SignupResponses = require('../../models/signupresponses').getModel();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('signup')
		.setDescription('Manage Signups, aka Events.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.CreateEvents)
        .addSubcommand(scCreate => 
            scCreate
                .setName('create')
                .setDescription('Create a new Signup')
                .addChannelOption(scCreateChannelOpt => 
                    scCreateChannelOpt
                        .setName('channel')
                        .setDescription('The channel to send the signup to')
                        .setRequired(true)
                )
                .addStringOption(scCreateTitleOpt => 
                    scCreateTitleOpt
                        .setName('title')
                        .setDescription('The signup title')
                        .setRequired(true)
                )
                .addStringOption(scCreateDescriptionOpt => 
                    scCreateDescriptionOpt
                        .setName('description')
                        .setDescription('The signup description')
                        .setRequired(true)
                )
                .addStringOption(scCreateStartTimeOpt => 
                    scCreateStartTimeOpt
                        .setName('start')
                        .setDescription('End time in UTC (Format: YYYY-MM-DDTHH:MM)')
                        .setRequired(true)
                )
                .addStringOption(scCreateStartTimeOpt => 
                    scCreateStartTimeOpt
                        .setName('end')
                        .setDescription('End time in UTC (Format: YYYY-MM-DDTHH:MM)')
                        .setRequired(true)
                )
        )
        .addSubcommandGroup(scgOptions => 
            scgOptions
                .setName('options')
                .setDescription('Manage and attach signup Options')
                .addSubcommand(scOptionsList => 
                    scOptionsList
                        .setName('list')
                        .setDescription('List all available options on this server')
                )
                .addSubcommand(scOptionsCreate => 
                    scOptionsCreate
                        .setName('create')
                        .setDescription('Create a new option')
                        .addStringOption(scOptionsCreateText => 
                            scOptionsCreateText
                                .setName('text')
                                .setDescription('Text to display for this option')
                                .setRequired(true)
                        )
                )
                .addSubcommand(scOptionsDelete => 
                    scOptionsDelete
                        .setName('delete')
                        .setDescription('Delete an option')
                        .addIntegerOption(scOptionsDeleteID => 
                            scOptionsDeleteID
                                .setName('option-id')
                                .setDescription('ID of the option to delete')
                                .setRequired(true)
                        )
                )
                .addSubcommand(scOptionsAttach => 
                    scOptionsAttach
                        .setName('attach')
                        .setDescription('Add the option to a Signup embed')
                        .addStringOption(scOptionsAttachMessageId => 
                            scOptionsAttachMessageId
                                .setName('signup-id')
                                .setDescription('The message ID of the signup embed')
                                .setRequired(true)
                        )
                        .addIntegerOption(scOptionsAttachOptionId => 
                            scOptionsAttachOptionId
                                .setName('option-id')
                                .setDescription('The option ID to add')
                                .setRequired(true)
                        )
                        .addIntegerOption(scOptionsAttachMaxValue => 
                            scOptionsAttachMaxValue
                                .setName('max-allowed')
                                .setDescription('Optional max users allowed for this option')
                        )
                )
        ),
	async execute(interaction) {
        const config = await Configs.findOne({where: {guildId: interaction.guild.id}});

	},
};
