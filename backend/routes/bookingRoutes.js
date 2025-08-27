const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Operations about bookings
 */

/**
 * @swagger
 * /booking:
 *   get:
 *     summary: Get Booking List
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: List of Bookings
 */
router.get('/', bookingController.getBookingList);

/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Get Booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /booking/addBooking:
 *   post:
 *     summary: Booking a room
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               building_code:
 *                 type: string
 *               room_code:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               booker_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/addBooking', bookingController.addBooking);

/**
 * @swagger
 * /booking/editBooking/{id}:
 *  put:
 *      summary: Edit a booking
 *      tags: [Booking]
 *      parameters:
 *          - name: id
 *          in: path
 *          required: true
 *          description: ID of the booking to edit
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *          schema:
 *              type: object
 *           properties:
 *              building_code:
 *                  type: string
 *              room_code:
 *                  type: string
 *              start_date:
 *                  type: string
 *              end_date:
 *                  type: string
 *              booker_name:
 *                  type: string
 *      responses:
 *          200:
 *              description: Booking updated successfully
 *          400:
 *              description: Bad request
 *          404:
 *              description: Booking not found
 *          500:
 *              description: Internal server error
 */
router.put('/editBooking/:id', bookingController.editBooking);

/**
 * @swagger
 * /booking/deleteBooking/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Booking]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete('/deleteBooking/:id', bookingController.deleteBooking);

module.exports = router;
