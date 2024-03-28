const mongoose = require('mongoose');

const itemForSaleSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ItemForSale', itemForSaleSchema, 'Items For Sale');