const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Operations about rooms
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all building
 */
router.get('/', roomController.getRooms);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room data
 */
router.get('/:id', roomController.getRoomById);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Add new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomCode:
 *                 type: string
 *               buildingCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 */
router.post('/addRoom', roomController.addRoom);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Edit room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomCode:
 *                 type: string
 *               buildingCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated successfully
 */
router.put('/editRoom/:id', roomController.editRoom);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
router.delete('/deleteRoom/:id', roomController.deleteRoom);


module.exports = router;
