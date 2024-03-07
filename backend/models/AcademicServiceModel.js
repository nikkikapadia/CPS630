const mongoose = require('mongoose');

const academicServicesSchema = new mongoose.Schema({
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

module.exports = mongoose.model('AcademicServices', academicServicesSchema, 'Academic Services');