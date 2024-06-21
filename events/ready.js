const { Events } = require("discord.js");
module.exports = {
    name: Events.ClientReady,
    niceName: "Ready",
    once: true,
    async execute(client){
        var now = new Date();
        console.log(`[OKAY] Logged in at ${now.toLocaleString("en-GB")}`);

        await client.sequelize.sync({ alter: true });
    }
};