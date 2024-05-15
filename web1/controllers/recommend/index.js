const express = require('express');
const { findRecommends, findRecommend, createRecommend, updateRecommend, deleteRecommend } = require('../../../../../../web-basiclly-finish(1)/databases/recommend');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Recommends
 *   description: Recommends management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommend:
 *       type: object
 *       required:
 *         - name
 *         - plant
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the plant
 *         name:
 *           type: string
 *           description: The name of the recommend
 *         approved:
 *           type: boolean
 *           description: The approved of the recommend
 *         approvedAt:
 *           type: string
 *           description: The approved time of the recommend
 *         suggestedAt:
 *           type: string
 *           description: The suggested time of the recommend
 *         plant:
 *           type: string
 *           description: The plant id of the recommend
 *         user:
 *           type: string
 *           description: The username
 */

/**
 * @swagger
 * /recommend/all:
 *   get:
 *     summary: Get all recommends
 *     tags: [Recommends]
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
 *                     $ref: '#/components/schemas/Recommend'
 *       500:
 *         description: Internal server error
 */
router.get('/all', async function (req, res, next) {
    try {
        const list = await findRecommends();
        res.status(200).json({ list: list.map(i => ({ id: i._id, ...i.toJSON(), })) });
    } catch (error) {
        res.status(500).json({ error })
    }
})
/**
 * @swagger
 * /recommendId/{recommendId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Recommends]
 *     parameters:
 *       - in: path
 *         name: recommendId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the recommend
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommend'
 *       404:
 *         description: Recommend not found
 *       500:
 *         description: Internal server error
 */
router.get('/:recommendId', async (req, res) => {
    try {
        const recommend = await findRecommend(req.params.recommendId);
        if (!recommend) {
            res.status(404).json({ error: 'Recommend not found' });
        } else {
            res.status(200).json({ id: recommend._id, ...recommend.toJSON() });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error finding recommend: ' + error });
    }
});
/**
 * @swagger
 * /recommend:
 *   post:
 *     summary: Create a new Recommend
 *     tags: [Recommends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recommend'
 *     responses:
 *       201:
 *         description: Recommend created
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the recommend
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    try {
        const newRecommend = await createRecommend(req.body);
        const { id } = newRecommend;
        res.status(201).json({
            id
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating recommend: ' + error });
    }
});

/**
 * @swagger
 * /recommends/{recommendId}:
 *   put:
 *     summary: Update a Recommend by ID
 *     tags: [Recommends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Recommend to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recommend updated
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the recommend
 *       400:
 *         description: Invalid request body or ID
 *       404:
 *         description: Recommend not found
 *       500:
 *         description: Server error
 */
router.put('/:recommendId', async (req, res) => {
    try {
        const recommend = await updateRecommend(req.params.recommendId, req.body);
        if (!recommend) {
            res.status(404).json({ error: 'Recommend not found' });
        } else {
            res.status(200).json(recommend);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating recommend: ' + error });
    }
});

/**
 * @swagger
 * /recommends/{recommendId}:
 *   delete:
 *     summary: Delete a Recommend by ID
 *     tags: [Recommends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Recommend to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Recommend deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Recommend not found
 *       500:
 *         description: Server error
 */
router.delete('/:recommendId', async (req, res) => {
    try {
        const recommend = await deleteRecommend(req.params.recommendId);
        if (!recommend) {
            res.status(404).json({ error: 'Recommend not found' });
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting recommend: ' + error });
    }
});

module.exports = router;