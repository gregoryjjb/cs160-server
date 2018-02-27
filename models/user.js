'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        googleId: {
            type: DataTypes.STRING,
            unique: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            isEmail: true
        },
        sessionId: DataTypes.STRING,
        loginDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
    
    User.associate = (models) => {
        models.User.hasMany(models.Video, {foreignKey: 'userId'});
    }
    
    return User;
};