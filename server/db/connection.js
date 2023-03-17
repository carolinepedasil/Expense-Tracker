const mongoose = require('mongoose');

const connection = mongoose.connect(process.env.ATLAS_URI)
    .then(database => {
        console.log('Database Connected');
        return database;
    }).catch(error => {
        console.log("Connection Error");
    });

module.exports = connection;
