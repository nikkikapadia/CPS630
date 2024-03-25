const mongoose = require('mongoose');

const itemWantedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    postDate: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    tags: [{
        type: String
    }],
    photos: [{
        type: String,
        required: false,
    }],
    price: {
        type: Number,
        required: true,
    },
    postedBy: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('ItemWanted', itemWantedSchema, 'Items Wanted');