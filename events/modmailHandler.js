const { Events, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const Configs = require("../models/configs").getModel();
const Modmails = require("../models/modmails").getModel();

module.exports = {
    name: Events.InteractionCreate,
    niceName: "Modmail Modal Submit Handler",
    once: false,
    async execute(interaction){
        if(!interaction.isModalSubmit() || interaction.customId != 'modmailModal'){
            return;
        }else{
            const titleResponse = interaction.fields.getTextInputValue("titleElement");
            const descriptionResponse = interaction.fields.getTextInputValue("descriptionElement");
            const config = await Configs.findOne({where: {guildId: interaction.guild.id}});
            const createModmail = await Modmails.create({
                authorId: interaction.user.id,
                title: titleResponse,
                description: descriptionResponse
            });
            await createModmail.save().then(async newModmail => {
                var embed = new EmbedBuilder()
                    .setTitle("New Modmail Ticket Created")
                    .addFields(
                        {name: titleResponse, value: descriptionResponse}
                    )
                    .setAuthor({iconURL: interaction.member.avatarURL()? interaction.member.avatarURL(): interaction.user.avatarURL(), name: interaction.user.username})
                    .setTimestamp(new Date())
                    .setColor('00bdf7');

                interaction.guild.channels.create({
                    name: `Ticket ${newModmail.id}`,
                    type: ChannelType.GuildText,
                    parent: config.modmailCategory,
                    permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ViewChannel]
                    }]
                }).then(async ticketChannel => {
                    createModmail.ticketChannelId = ticketChannel.id;
                    await createModmail.save();
                    ticketChannel.send({embeds: [embed]}).then(async () => {
                        await interaction.reply({content: "We have received your modmail request and will be in touch if we require any further information.", ephemeral: true});
                    });
                });
            });
        }
    }
};