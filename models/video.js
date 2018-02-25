'use strict';

module.exports = (sequelize, DataTypes) => {
    var Video = sequelize.define('Video', {
        name: DataTypes.STRING,
        length: DataTypes.FLOAT
    });
    
    Video.associate = (models) => {
        models.Video.belongsTo(models.User, {foreignKey: 'userId'});
    }
    
    return Video;
};