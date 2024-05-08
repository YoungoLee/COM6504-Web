const mongoose = require('mongoose');
const User = require('../models/user');
const { mongoDB } = require('../constant');

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, {
    checkServerIdentity: false
}).then(() => {
    console.log('Connection MongoDB Successful!')
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error)
})

async function createUser(nickname) {
    try {
        const user = new User({ nickname });
        const newUser = await user.save();
        return { id: newUser.id };
    } catch (error) {
        throw new Error(error)
    }
}

async function deleteUser(userId) {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (user) {
            return { id: userId }
        } else {
            return { error: 'User no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function findUsers() {
    try {
        return await User.find();
    } catch (error) {
        throw new Error(error)
    }
}

async function findUser(userId) {
    try {
        const user = await User.findById(userId);
        if (user) {
            return user
        } else {
            return { error: 'User no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function updateUser(userId, updateData) {
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (user) {
            return { id: user.id }
        } else {
            return { error: 'User no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createUser,
    deleteUser,
    findUsers,
    findUser,
    updateUser
}