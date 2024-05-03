const mongoose = require('mongoose');
const Recommend = require('../models/recommend');
const { mongoDB } = require('../constant');

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, {
    checkServerIdentity: false
}).then(() => {
    console.log('Connection MongoDB Successful!')
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error)
})


async function createRecommend(data) {
    try {
        const recommend = new Recommend(data);
        const newRecommend = await recommend.save();
        return { id: newRecommend.id };
    } catch (error) {
        throw new Error(error)
    }
}

async function deleteRecommend(recommendId) {
    try {
        const recommend = await Recommend.findByIdAndDelete(recommendId);
        if (recommend) {
            return { id: recommendId }
        } else {
            return { error: 'Recommend no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function findRecommends() {
    try {
        return await Recommend.find();
    } catch (error) {
        throw new Error(error)
    }
}

async function findRecommend(recommendId) {
    try {
        const recommend = await Recommend.findById(recommendId);
        if (recommend) {
            return recommend
        } else {
            return { error: 'Recommend no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function updateRecommend(recommendId, updateData) {
    try {
        const recommend = await Recommend.findByIdAndUpdate(recommendId, updateData, { new: true });
        if (recommend) {
            return { id: recommend.id }
        } else {
            return { error: 'Recommend no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createRecommend,
    deleteRecommend,
    findRecommends,
    findRecommend,
    updateRecommend
}