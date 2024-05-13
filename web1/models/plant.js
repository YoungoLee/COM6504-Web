const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress'],
        default: 'in-progress'
    },
    photo: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    sawTime: {
        type: Date,
        default: Date.now
    },
    dbpedia: {
        commonName: {
            type: String,
        },
        scientificName: {
            type: String,
        },
        description: {
            type: String,
        },
        uri: {
            type: String,
        },
    },
    size: {
        height: {
            type: String,
        },
        spread: {
            type: String,
        },
    },
    characteristics: {
        hasFlowers: {
            type: Boolean,
        },
        hasLeaves: {
            type: Boolean,
        },
        hasFruits: {
            type: Boolean,
        },
        hasSeeds: {
            type: Boolean,
        },
        flowerColor: {
            type: String,
        },
        sunExposure: {
            type: String,
            enum: ['full sun', 'partial shade', 'full shade']
        },
    },
    location: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Plant', plantSchema);