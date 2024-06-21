const { DataTypes } = require("sequelize");

module.exports = {
    name: 'Modmails',
    init(sequelize){
        const Modmails =  sequelize.define('Modmails', {
            authorId: DataTypes.STRING,
            title: DataTypes.STRING(100),
            description: DataTypes.STRING(1000),
            ticketChannelId: DataTypes.STRING
        });
        this.model = Modmails;
        return Modmails;
    },
    getModel(){
        return this.model;
    }
};