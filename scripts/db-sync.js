var models = require('../models');

console.log('Synchronizing models to database...');
console.log('***********************************');

models.sequelize.sync({force: true})
.then(() => {
    console.log('***********************************');
    console.log('Models synced');
});