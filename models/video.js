'use strict';

module.exports = (sequelize, DataTypes) => {
    var Video = sequelize.define('Video', {
        name: DataTypes.STRING,
        length: DataTypes.FLOAT
    });
    
    return Video;
};