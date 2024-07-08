const { DataTypes } = require("sequelize");

module.exports = {
    name: 'SignupResponses',
    init(sequelize){
        const SignupResponses = sequelize.define('SignupResponses', {
            signupId: {
                type: DataTypes.STRING,
                references: {
                    model: 'Signups',
                    key: 'id'
                }
            },
            memberId: DataTypes.STRING,
            attachmentId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'SignupAttachments',
                    key: 'id'
                }
            }
        });
        this.model = SignupResponses;
        return SignupResponses;
    },
    getModel(){
        return this.model;
    }
};