const mongoose = require('mongoose');
const Comment = require('../models/comment');
const { mongoDB } = require('../constant');

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, {
    checkServerIdentity: false
}).then(() => {
    console.log('Connection MongoDB Successful!')
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error)
})


async function createComment(data) {
    try {
        const comment = new Comment(data);
        const newComment = await comment.save();
        return { id: newComment.id };
    } catch (error) {
        throw new Error(error)
    }
}

async function deleteComment(commentId) {
    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (comment) {
            return { id: commentId }
        } else {
            return { error: 'Comment no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function findComments() {
    try {
        return await Comment.find();
    } catch (error) {
        throw new Error(error)
    }
}

async function findComment(commentId) {
    try {
        const comment = await Comment.findById(commentId);
        if (comment) {
            return comment
        } else {
            return { error: 'Comment no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function updateComment(commentId, updateData) {
    try {
        const comment = await Comment.findByIdAndUpdate(commentId, updateData, { new: true });
        if (comment) {
            return { id: comment.id }
        } else {
            return { error: 'Comment no found' }
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createComment,
    deleteComment,
    findComments,
    findComment,
    updateComment
}