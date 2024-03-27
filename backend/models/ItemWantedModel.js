const mongoose = require('mongoose');

const itemWantedSchema = new mongoose.Schema({
    title: {
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
        type: String,
        required: false,
    }],
    photos: [{
        type: String,
        required: true,
    }],
    price: {
        type: Number,
        required: true,
    },
    author: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('ItemWanted', itemWantedSchema, 'Items Wanted');