'use strict';

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        googleid: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: DataTypes.STRING
    });
    
    return User;
};