const { DataTypes } = require("sequelize");

module.exports = {
    name: 'Signups',
    init(sequelize){
        const Signups = sequelize.define('Signups', {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                unique: true,
                autoIncrement: false
            },
            guildId: DataTypes.STRING,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            startTimestamp: DataTypes.NUMBER,
            endTimestamp: DataTypes.NUMBER,
            channelId: DataTypes.STRING
        });
        this.model = Signups;
        return Signups;
    },
    getModel(){
        return this.model;
    }
};