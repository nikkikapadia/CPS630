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
        city: {
            type: String,
            required: false,
        },
        postalCode: {
            type: String,
            required: false,
        },
    },
    tags: [{
        type: String
    }],
    photo: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    postedBy: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('ItemWanted', itemWantedSchema, 'Items Wanted');