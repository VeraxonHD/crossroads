const { DataTypes } = require("sequelize");

module.exports = {
    name: 'SignupOptions',
    init(sequelize){
        const SignupOptions = sequelize.define('SignupOptions', {
            guildId: DataTypes.STRING,
            text: DataTypes.STRING,
            emoji: DataTypes.STRING
        });
        this.model = SignupOptions;
        return SignupOptions;
    },
    getModel(){
        return this.model;
    }
};