const { Events, userMention } = require("discord.js");
const { Op } = require("sequelize");
const Signups = require("../models/signups.js").getModel();
const SignupResponses = require("../models/signupresponses.js").getModel();
const SignupOptions = require("../models/signupoptions.js").getModel();
const SignupAttachments = require("../models/signupattachments.js").getModel();

//TODO: all MAX USER considerations

module.exports = {
    name: Events.InteractionCreate,
    niceName: "Signup Handler",
    once: false,
    async execute(interaction){
        if(interaction.isButton() && interaction.customId.split('-')[0] == 'signupOption'){
            //Build Attachments Model
            SignupAttachments.hasOne(SignupOptions, {foreignKey: "id", sourceKey: "optionId"});
            SignupAttachments.hasOne(Signups, {foreignKey: "id", sourceKey: "signupId"});

            const attachment = await SignupAttachments.findOne(
                {
                    where: {
                        [Op.and]: [
                            {signupId: interaction.message.id},
                            {optionId: interaction.customId.split('-')[1]}
                        ]
                    },
                    include: [Signups, SignupOptions]
                }
            );

            //Build Responses Model
            SignupResponses.hasOne(SignupAttachments, {foreignKey: "id", sourceKey: "attachmentId"});
            SignupResponses.hasOne(Signups, {foreignKey: "id", sourceKey: "signupId"});
    
            const responses = await SignupResponses.findAll(
                {
                    where: {
                        signupId: interaction.message.id,
                        attachmentId: attachment.id
                    },
                    include: [Signups, SignupAttachments]
                }
            );

            if(attachment.Signup && attachment.SignupOption){
                var embed = interaction.message.embeds[0];

                //If field for this option does not exist
                if(!attachment.fieldIndex){
                    console.log("doesnt exist")
                    var optionEmoji = await interaction.client.emojis.resolve(attachment.SignupOption.emoji);
                    if(optionEmoji){
                        if(attachment.maxAllowed){
                            embed.fields.push({value: `${userMention(interaction.member.id)}`, name: `${optionEmoji.toString()} ${attachment.SignupOption.text} (Max: ${attachment.maxAllowed})`, inline: true});
                        }else{
                            embed.fields.push({value: `${userMention(interaction.member.id)}`, name: `${optionEmoji.toString()} ${attachment.SignupOption.text}`, inline: true});
                        }
                    }else{
                        if(attachment.maxAllowed){
                            embed.fields.push({value: `${userMention(interaction.member.id)}`, name: `${attachment.SignupOption.text} (Max: ${attachment.maxAllowed})`, inline: true});
                        }else{
                            embed.fields.push({value: `${userMention(interaction.member.id)}`, name: `${attachment.SignupOption.text}`, inline: true});
                        }
                    }
                    await SignupResponses.create({
                        where: {
                            signupId: interaction.message.id,
                            memberId: interaction.member.id,
                            attachmentId: attachment.id
                        }
                    });
                    
                    await attachment.update({fieldIndex: embed.fields.length - 1});
                    await attachment.save();

                    await interaction.reply({content: `You have signed up for **${attachment.SignupOption.text}**.`, ephemeral: true});
                
                }else{
                    var [CINEResponse, created] = await SignupResponses.findOrCreate({
                        where: {
                            signupId: interaction.message.id,
                            memberId: interaction.member.id,
                            attachmentId: attachment.id
                        }
                    });

                    
                    //console.log(embed.fields[targetEmbedFieldIndex].value)
                    if(created){
                        var users = [];
                        responses.forEach(existingResponse => {
                            users.push(userMention(existingResponse.memberId));
                        });
                        users.push(userMention(CINEResponse.memberId));
                        embed.fields[attachment.fieldIndex].value = users.join("\n");
                        await interaction.reply({content: `You have signed up for **${attachment.SignupOption.text}**.`, ephemeral: true});
                    }else{
                        await CINEResponse.destroy().then(async (deletedResponse) => {
                            var users = [];
                            for(var i in responses){
                                if(responses[i].memberId != deletedResponse.memberId){
                                    users.push(userMention(responses[i].memberId));
                                }
                            }
                            embed.fields[attachment.fieldIndex].value = users.join("\n");
                            await interaction.reply({content: `Your signup for **${attachment.SignupOption.text}** has been removed.`, ephemeral: true});
                        });
                    }
                }
                await interaction.message.edit({embeds: [embed]});
            }
        }
    }
};