var Sequelize = require('sequelize');

module.exports = {
    development: {
        db: {
            dialect: 'sqlite',
            storage: './db/db.development.sqlite',
            logging: false,
            operatorsAliases: Sequelize.Op,
            sync: {force: true}
        }
    },
    production: {
        db: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOSTNAME,
            logging: false,
            operatorsAliases: Sequelize.Op
        }
    }
}