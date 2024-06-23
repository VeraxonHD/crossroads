const { DataTypes } = require("sequelize");

module.exports = {
    name: 'SignupAttachments',
    init(sequelize){
        const SignupAttachments = sequelize.define('SignupAttachments', {
            signupId: DataTypes.INTEGER,
            optionId: DataTypes.INTEGER,
            actionRowIndex: DataTypes.INTEGER
        });
        this.model = SignupAttachments;
        return SignupAttachments;
    },
    getModel(){
        return this.model;
    }
};