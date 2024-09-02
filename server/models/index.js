const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const mongoose = require('mongoose');

const models = {};
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(async file => {
        const schema = require(path.join(__dirname, file));
        const model = mongoose.model(schema.collectionName, schema.collectionSchema)
        models[schema.collectionName] = model
    });

module.exports = models;