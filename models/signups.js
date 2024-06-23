const { DataTypes } = require("sequelize");

module.exports = {
    name: 'Signups',
    init(sequelize){
        const Signups = sequelize.define('Signups', {
            guildId: DataTypes.STRING,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            startTimestamp: DataTypes.NUMBER,
            endTimestamp: DataTypes.NUMBER,
            messageId: DataTypes.STRING
        });
        this.model = Signups;
        return Signups;
    },
    getModel(){
        return this.model;
    }
};