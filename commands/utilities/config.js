const { SlashCommandBuilder, channelMention, ChannelType, PermissionFlagsBits } = require('discord.js');
const Configs = require('../../models/configs').getModel();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configure settings for this server.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommandGroup(scgModmail => 
            scgModmail
                .setName('modmail')
                .setDescription('Configure Modmail')
                .addSubcommand(scModmailEnabled => 
                    scModmailEnabled
                        .setName('enable')
                        .setDescription('Toggle modmail on/off')
                        .addBooleanOption(scModmailEnabledOpts => 
                            scModmailEnabledOpts
                                .setName("enabled")
                                .setDescription("Whether or not to enable modmail")
                                .setRequired(true)
                        )
                )
                .addSubcommand(scModmailCategory => 
                    scModmailCategory
                        .setName('category')
                        .setDescription('Set modmail parent category')
                        .addChannelOption(scModmailCategoryOpts => 
                            scModmailCategoryOpts
                                .setName("category")
                                .setDescription("Category to set")
                                .setRequired(true)
                        )
                )
        )
        .addSubcommand(scLogChannel => 
            scLogChannel
                .setName("logchannel")
                .setDescription("Set log channel")
                .addChannelOption(scLogChannelOpts => 
                    scLogChannelOpts
                        .setName("channel")
                        .setDescription("Channel to set")
                        .setRequired(true)
                )
        )
        .addSubcommandGroup(scgStarboard => 
            scgStarboard
                .setName('starboard')
                .setDescription('Configure Starboard')
                .addSubcommand(scStarboardEnabled => 
                    scStarboardEnabled
                        .setName('enable')
                        .setDescription('Toggle starboard on/off')
                        .addBooleanOption(scStarboardEnabledOpts => 
                            scStarboardEnabledOpts
                                .setName("enabled")
                                .setDescription("Whether or not to enable starboard")
                                .setRequired(true)
                        )
                )
                .addSubcommand(scStarboardChannel => 
                    scStarboardChannel
                        .setName('channel')
                        .setDescription('Set starboard channel')
                        .addChannelOption(scStarboardChannelOpts => 
                            scStarboardChannelOpts
                                .setName("channel")
                                .setDescription("Channel to set")
                                .setRequired(true)
                        )
                )
        ),
	async execute(interaction) {
        const config = await Configs.findOne({where: {guildId: interaction.guild.id}});
        var subCommand = interaction.options.getSubcommand();
        var subCommandGroup = interaction.options.getSubcommandGroup();
        if(subCommand === 'logchannel'){
            try{
                var newChannel = interaction.options.getChannel('channel');
                if(newChannel.type == ChannelType.GuildText){
                    config.logchannelId = newChannel.id;
                    await config.save();
                    interaction.reply(`Updated configured logchannel to ${channelMention(newChannel.id)}`);
                }else{
                    interaction.reply(`Sorry, that is not a Text channel. Please provide the ID of a text channel.`);
                }
            }catch(err){
                interaction.reply("Unable to change configured logchannel. Please try again later.");
                console.error(err);
            }
        }else if(subCommandGroup === 'modmail'){
            if(subCommand === 'enable'){
                try{
                    var newState = interaction.options.getBoolean('enabled');
                    config.modmailEnabled = newState;
                    await config.save();
                    interaction.reply(`Updated modmail enabled to \`${newState}\``);
                }catch(err){
                    interaction.reply("Unable to change the modmail enabled setting. Please try again later.");
                }
            }else if(subCommand === 'category'){
                try{
                    var newCategory = interaction.options.getChannel('category');
                    if(newCategory.type == ChannelType.GuildCategory){
                        config.modmailCategory = newCategory.id;
                        await config.save();
                        interaction.reply(`Updated modmail category to \`${newCategory.name}\``);
                    }else{
                        interaction.reply(`Sorry, that is not a Category channel. Please provide the ID of a category channel.`);
                    }
                }catch(err){
                    interaction.reply("Unable to change the modmail category setting. Please try again later.");
                }
            }
        }else if(subCommandGroup === 'starboard'){
            if(subCommand === 'enable'){
                try{
                    var newState = interaction.options.getBoolean('enabled');
                    config.starboardEnabled = newState;
                    await config.save();
                    interaction.reply(`Updated starboard enabled to \`${newState}\``);
                }catch(err){
                    interaction.reply("Unable to change the starboard enabled setting. Please try again later.");
                }
            }else if(subCommand === 'channel'){
                try{
                    var newChannel = interaction.options.getChannel('channel');
                    if(newChannel.type == ChannelType.GuildText){
                        config.starboardChannel = newChannel.id;
                        await config.save();
                        interaction.reply(`Updated starboard channel to \`${newChannel.name}\``);
                    }else{
                        interaction.reply(`Sorry, that is not a Text channel. Please provide the ID of a Text channel.`);
                    }
                }catch(err){
                    interaction.reply("Unable to change the starboard channel setting. Please try again later.");
                }
            }
        }
	},
};