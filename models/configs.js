const { DataTypes } = require("sequelize");

module.exports = {
    name: 'Configs',
    init(sequelize){
        const Configs = sequelize.define('Configs', {
            guildId: DataTypes.STRING,
            logchannelId: DataTypes.STRING,
            modmailEnabled: DataTypes.BOOLEAN,
            modmailCategory: DataTypes.STRING,
            starboardEnabled: DataTypes.BOOLEAN,
            starboardChannel: DataTypes.BOOLEAN
        });
        this.model = Configs;
        return Configs;
    },
    getModel(){
        return this.model;
    }
};