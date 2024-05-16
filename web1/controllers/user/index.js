const express = require('express');
const { findUsers, findUser, createUser, updateUser, deleteUser } = require('../../../../../../web-basiclly-finish(1)/databases/user');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nickname
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         nickname:
 *           type: string
 *           description: The nickname of the user
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/all', async function (req, res, next) {
    try {
        const list = await findUsers();
        res.status(200).json({ list: list.map(i => ({ id: i._id, nickname: i.nickname })) });
    } catch (error) {
        res.status(500).json({ error })
    }
})
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', async (req, res) => {
    try {
        const user = await findUser(req.params.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ id: user._id, nickname: user.nickname });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error finding user: ' + error });
    }
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               nickname:
 *                 type: string
 *             example:
 *               nickname: JohnDoe
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the user
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    const { nickname } = req.body
    try {
        const newUser = await createUser(nickname);
        const { id } = newUser;
        res.status(201).json({
            id,
            nickname
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user: ' + error });
    }
});

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', async (req, res) => {
    try {
        const user = await updateUser(req.params.userId, req.body);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user: ' + error });
    }
});

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:userId', async (req, res) => {
    try {
        const user = await deleteUser(req.params.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user: ' + error });
    }
});

module.exports = router;