const express = require('express');
const { findPlants, findPlant, createPlant, updatePlant, deletePlant } = require('../../../../../../web-basiclly-finish(1)/databases/plant');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plants
 *   description: Plant management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Plant:
 *       type: object
 *       required:
 *         - name
 *         - photo
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the plant
 *         name:
 *           type: string
 *           description: The name of the plant
 *         description:
 *           type: string
 *           description: The description of the plant
 *         status:
 *           type: string
 *           description: The status of the plant
 *           enum:
 *               - completed
 *               - in-progress
 *         photo:
 *           type: string
 *           description: The photo of the plant
 *         sawTime:
 *           type: string
 *           description: The sawTime of the plant
 *         user:
 *           type: string
 *           description: The user of the plant
 *         size:
 *           type: object
 *           properties:
 *             height:
 *               type: number
 *               description: The height of the plant size
 *             spread:
 *               type: string
 *               description: The spread of the plant size
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: The latitude of the plant location
 *             longitude:
 *               type: string
 *               description: The longitude of the plant location
 *         userLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: The latitude of the plant location
 *             longitude:
 *               type: string
 *               description: The longitude of the plant location
 *         characteristics:
 *           type: object
 *           properties:
 *             hasFlowers:
 *               type: boolean
 *               description: The hasFlowers of the plant characteristics
 *             hasLeaves:
 *               type: boolean
 *               description: The hasLeaves of the plant characteristics
 *             hasFruits:
 *               type: boolean
 *               description: The hasFruits of the plant characteristics
 *             hasSeeds:
 *               type: boolean
 *               description: The hasSeeds of the plant characteristics
 *             flowerColor:
 *               type: string
 *               description: The flower color of the plant characteristics
 *             sunExposure:
 *               type: string
 *               enum:
 *                   - full sun
 *                   - partial shade
 *                   - full shade
 */

/**
 * @swagger
 * /plant/all:
 *   get:
 *     summary: Get all plants
 *     tags: [Plants]
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
 *                     $ref: '#/components/schemas/Plant'
 *       500:
 *         description: Internal server error
 */
router.get('/all', async function (req, res, next) {
    const params = {};
    const sort = {};
    const {
        name,
        hasFlowers,
        hasLeaves,
        hasFruits,
        hasSeeds,
        sunExposure,
        sawTime,
        distance,
        longitude,
        latitude
    } = req.query;
    if (name) {
        const regex = new RegExp(name, 'i');
        Object.assign(params, { name: regex })
    }
    if (sunExposure) {
        const regex = new RegExp(sunExposure, 'i');
        Object.assign(params, { "characteristics.sunExposure": regex })
    }
    if (typeof hasFlowers === 'boolean') {
        Object.assign(params, { "characteristics.hasFlowers": hasFlowers })
    }
    if (typeof hasLeaves === 'boolean') {
        Object.assign(params, { "characteristics.hasLeaves": hasLeaves })
    }
    if (typeof hasFruits === 'boolean') {
        Object.assign(params, { "characteristics.hasFruits": hasFruits })
    }
    if (typeof hasFlowers === 'boolean') {
        Object.assign(params, { "characteristics.hasSeeds": hasSeeds })
    }
    if (['1', '-1'].includes(sawTime)) {
        Object.assign(sort, { sawTime: Number(sawTime) })
    }
    if (['1', '-1'].includes(distance) && longitude && latitude) {
        const userLocation = [longitude, latitude];
        Object.assign(params, {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: userLocation
                    }
                }
            }
        })
    }

    try {
        let list = await findPlants(params, sort);
        if (distance === '-1' && longitude && latitude) {
            list = list.reverse();
        }
        res.status(200).json({ list: list.map(i => ({ id: i._id, ...i.toJSON(), })) });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ error })
    }
})
/**
 * @swagger
 * /plant/{plantId}:
 *   get:
 *     summary: Get a plant by ID
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: plantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the plant
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Internal server error
 */
router.get('/:plantId', async (req, res) => {
    try {
        const plant = await findPlant(req.params.plantId);
        if (!plant) {
            res.status(404).json({ error: 'Plant not found' });
        } else {
            res.status(200).json({ id: plant._id, ...plant.toJSON() });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error finding plant: ' + error });
    }
});

/**
 * @swagger
 * /plant:
 *   post:
 *     summary: Create a new plant
 *     tags: [Plants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plant'
 *     responses:
 *       201:
 *         description: Plant created
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the plant
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    try {
        const newPlant = await createPlant(req.body);
        const { id } = newPlant;
        res.status(201).json({
            id
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating plant: ' + error });
    }
});

/**
 * @swagger
 * /plant/{plantId}:
 *   put:
 *     summary: Update a plant by ID
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: plantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the plant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plant'
 *     responses:
 *       200:
 *         description: Plant updated
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The auto-generated ID of the plant
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Internal server error
 */
router.put('/:plantId', async (req, res) => {
    try {
        const plant = await updatePlant(req.params.plantId, req.body);
        if (!plant) {
            res.status(404).json({ error: 'Plant not found' });
        } else {
            res.status(200).json(plant);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating plant: ' + error });
    }
});

/**
 * @swagger
 * /plant/{plantId}:
 *   delete:
 *     summary: Delete a plant by ID
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: plantId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the plant
 *     responses:
 *       200:
 *         description: Plant deleted
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:plantId', async (req, res) => {
    try {
        const plant = await deletePlant(req.params.plantId);
        if (!plant) {
            res.status(404).json({ error: 'Plant not found' });
        } else {
            res.status(200).end();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting plant: ' + error });
    }
});

module.exports = router;