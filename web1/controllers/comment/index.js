const express = require('express');
const { findComments, findComment, createComment, updateComment, deleteComment } = require('../../../../../../web-basiclly-finish(1)/databases/comment');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - name
 *         - plant
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the plant
 *         comment:
 *           type: string
 *           description: The content of the comment
 *         createdAt:
 *           type: string
 *           description: The created time of the comment
 *         plant:
 *           type: string
 *           description: The plant id of the comment
 *         user:
 *           type: string
 *           description: The user id of the comment
 */

/**
 * @swagger
 * /comment/all:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */
router.get('/all', async function (req, res, next) {
    try {
        const list = await findComments();
        res.status(200).json({ list: list.map(i => ({ id: i._id, ...i.toJSON(), })) });
    } catch (error) {
        res.status(500).json({ error })
    }
})
/**
 * @swagger
 * /commentId/{commentId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:commentId', async (req, res) => {
    try {
        const comment = await findComment(req.params.commentId);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
        } else {
            res.status(200).json({ id: comment._id, ...comment.toJSON() });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error finding comment: ' + error });
    }
});
/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new Comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the comment
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    try {
        const newComment = await createComment(req.body);
        const { id } = newComment;
        const comment = await findComment(id);
        res.status(201).json({
            id,
            ...comment.toJSON()
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating comment: ' + error });
    }
});

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update a Comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Comment to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the comment
 *       400:
 *         description: Invalid request body or ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/:commentId', async (req, res) => {
    try {
        const comment = await updateComment(req.params.commentId, req.body);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
        } else {
            res.status(200).json(comment);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating comment: ' + error });
    }
});

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a Comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:commentId', async (req, res) => {
    try {
        const comment = await deleteComment(req.params.commentId);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting comment: ' + error });
    }
});

module.exports = router;