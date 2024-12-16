const { DataTypes } = require("sequelize");

module.exports = {
    name: 'StarboardResponses',
    init(sequelize){
        const StarboardResponses = sequelize.define('StarboardResponses', {
            starboardEntryId: {
                type: DataTypes.STRING,
                primaryKey: true,
                unique: true,
                autoIncrement: false
            },
            messageId: {
                type: DataTypes.STRING,
                unique: true
            },
            stars: {
                type: DataTypes.NUMBER
            }
        });
        this.model = StarboardResponses;
        return StarboardResponses;
    },
    getModel(){
        return this.model;
    }
};