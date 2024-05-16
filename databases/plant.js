const mongoose = require('mongoose');
const Plant = require('../models/plant');
const { mongoDB } = require('../constant');

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, {
    checkServerIdentity: false
}).then(() => {
    console.log('Connection MongoDB Successful!')
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error)
})


async function createPlant(data) {
    try {
        const plant = new Plant(data);
        const newPlant = await plant.save();
        return { id: newPlant.id };
    } catch (error) {
        throw new Error(error)
    }
}

async function deletePlant(plantId) {
    try {
        const plant = await Plant.findByIdAndDelete(plantId);
        if (plant) {
            return { id: plantId }
        } else {
            return { error: 'Plant no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function findPlants(params = {}, sort = {}) {
    try {
        return await Plant.find(params).sort(sort);
    } catch (error) {
        throw new Error(error)
    }
}

async function findPlant(plantId) {
    try {
        const plant = await Plant.findById(plantId);
        if (plant) {
            return plant
        } else {
            return { error: 'Plant no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function updatePlant(plantId, updateData) {
    try {
        const plant = await Plant.findByIdAndUpdate(plantId, updateData, { new: true });
        if (plant) {
            return { id: plant.id }
        } else {
            return { error: 'Plant no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createPlant,
    deletePlant,
    findPlants,
    findPlant,
    updatePlant
}