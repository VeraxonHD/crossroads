const { DataTypes } = require("sequelize");

module.exports = {
    name: 'SignupAttachments',
    init(sequelize){
        const SignupAttachments = sequelize.define('SignupAttachments', {
            signupId: {
                type: DataTypes.STRING,
                references: {
                    model: 'Signups',
                    key: 'id'
                }
            },
            optionId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'SignupOptions',
                    key: 'id'
                }
            },
            actionRowIndex: DataTypes.INTEGER,
            maxAllowed: DataTypes.INTEGER,
            fieldIndex: DataTypes.INTEGER
        });
        this.model = SignupAttachments;
        return SignupAttachments;
    },
    getModel(){
        return this.model;
    }
};