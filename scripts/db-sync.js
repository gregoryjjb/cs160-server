const models = require('../models');
const fs = require('fs');
const path = require('path');

console.log("Deleting video files..");
fs.readdir('./videos', (err, files) => {
    if (err) throw err;

    for (const file of files) {
        if(file !== '.gitkeep') {
            fs.unlink(path.join('./videos', file), err => {
                if (err) throw err;
            });
        }
    }
});
console.log("Files deleted");

console.log('Synchronizing models to database...');
console.log('***********************************');

models.sequelize.sync({force: true})
.then(() => {
    console.log('***********************************');
    console.log('Models synced');
});