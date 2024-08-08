// const CONFIG = require("../../../config.js")

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Chat').then(() => {
    console.log('DB connection established');
}).catch(error => {
    console.error('could not establish mongoose connection', error);
});

// mongoose.set('debug', true)
