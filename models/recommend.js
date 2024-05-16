const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendSchema = new Schema({
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    suggestedAt: {
        type: Date,
        default: Date.now
    },
    approved: {
        type: Boolean,
        default: false
    },
    approvedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Recommend', recommendSchema);