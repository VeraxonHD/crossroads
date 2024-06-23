const { DataTypes } = require("sequelize");

module.exports = {
    name: 'SignupResponses',
    init(sequelize){
        const SignupResponses = sequelize.define('SignupResponses', {
            signupId: DataTypes.INTEGER,
            memberId: DataTypes.STRING,
            optionId: DataTypes.INTEGER
        });
        this.model = SignupResponses;
        return SignupResponses;
    },
    getModel(){
        return this.model;
    }
};