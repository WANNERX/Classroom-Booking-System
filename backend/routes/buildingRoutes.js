const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

/**
 * @swagger
 * tags:
 *   name: Building
 *   description: Operations about building
 */

/**
 * @swagger
 * /building:
 *   get:
 *     summary: Get all building
 *     tags: [Building]
 *     responses:
 *       200:
 *         description: List of all building
 */
router.get('/', buildingController.getBuildings);

module.exports = router;
