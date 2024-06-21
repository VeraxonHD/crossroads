const { SlashCommandBuilder, channelMention, ChannelType } = require('discord.js');
const Configs = require('../../models/configs').getModel();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configure settings for this server.')
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
                        interaction.reply(`Updated modmail enabled to \`${newCategory.name}\``);
                    }else{
                        interaction.reply(`Sorry, that is not a Category channel. Please provide the ID of a category channel.`);
                    }
                }catch(err){
                    interaction.reply("Unable to change the modmail enabled setting. Please try again later.");
                }
            }
        }
	},
};