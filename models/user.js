'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        googleid: {
            type: DataTypes.STRING,
            unique: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            isEmail: true
        }
    });
    
    return User;
};