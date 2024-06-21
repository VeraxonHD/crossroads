const { Events, ChannelType } = require("discord.js");
const Configs = require("../models/configs").getModel();
module.exports = {
    name: Events.GuildCreate,
    niceName: "Join Guild",
    once: true,
    async execute(guild){
        const config = await Configs.findOne({where: {guildId: guild.id}});
        if(!config){
            guild.channels.create({
                name: "logchannel",
                type: ChannelType.GuildText
            }).then(async newChannel => {
                var newConfig = await Configs.create({
                    guildId: guild.id,
                    logchannelId: newChannel.id
                });
                await newConfig.save().then(() => {
                    newChannel.send(`Thanks for installing <bot name placeholder>! I've created this channel to get you started, as all logged data from the bot will go here. Please feel free to re-set this with the command </config logchannel:1253359979487035513>`);
                });
            });
        }
    }
};