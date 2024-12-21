const { Events, userMention, EmbedBuilder } = require("discord.js");
const { Op } = require("sequelize");
const Starboards = require("../models/starboards.js").getModel();
const Configs = require("../models/configs.js").getModel();

module.exports = {
    name: Events.MessageReactionAdd,
    niceName: "starboardEntry Handler",
    once: false,
    async execute(messageReaction, user, details){
        // Get full message if partial
        if(messageReaction.partial){
            try{
                await messageReaction.fetch()
            }catch (err) {
                console.error("Failed to fetch message reaction: ", err);
                return;
            }
        }

        const message = messageReaction.message;
        const guild = message.guild;

        if(user.id === messageReaction.client.user.id) return;

        const config = await Configs.findOne({where: {guildId: guild.id}});
        if(config.starboardEnabled && message.channel.id != guild.starboardChannel){
            if(messageReaction.emoji.name == '⭐' && messageReaction.count >= 2){
                const starboardEntry = await Starboards.findOne({where: {messageId: message.id}})
                if(starboardEntry){
                    await starboardEntry.increment('stars');
                    const starboardChannel = await guild.channels.fetch(config.starboardChannel);
                    if(starboardChannel){
                        const message = await starboardChannel.messages.fetch(starboardEntry.starboardEntryId);
                        var embed = message.embeds[0]
                        await message.edit({content: `**${starboardEntry.stars + 1}**⭐`, embeds: [embed]})
                    }
                }else{
                    const starboardChannel = await guild.channels.fetch(config.starboardChannel);
                    if(starboardChannel){
                        if(message.partial){
                            try{
                                await message.fetch()
                            }catch (err) {
                                console.error("Failed to fetch message: ", err);
                                return;
                            }
                        }

                        var content = message.content;
                        if(content == ''){
                            content = "-# Message content was blank"
                        }

                        var embed = new EmbedBuilder()
                            .setAuthor({iconURL: message.author.avatarURL(), name: message.author.username})
                            .setDescription(content)
                            .setURL(message.url)
                            .setTitle("Jump to Original");
                        if(message.attachments.size > 0){
                            embed.setImage(message.attachments.first().url)
                        }
                        await starboardChannel.send({embeds: [embed], content: "**2**⭐"}).then(async (sbMsg) => {
                            await Starboards.create({
                                starboardEntryId: sbMsg.id,
                                messageId: message.id,
                                channelId: message.channel.id,
                                stars: 2
                            })
                        })
                    }
                }
            }else{
                console.log("starboardEntry picked non-⭐ emoji... Ignoring.")
            }
        }        
    }
};