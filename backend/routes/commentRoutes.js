const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const multer = require('multer');
const path = require('path');

// ตั้งค่าการจัดเก็บไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/comments/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * /comment/{booking_id}:
 *   get:
 *     summary: Get Comment List by Booking ID
 *     tags: [Comment]
 *     parameters:
 *       - name: booking_id
 *         in: path
 *         required: true
 *         description: Booking Id of comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of Comments for the Booking
 *       404:
 *         description: Comments not found
 *       500:
 *         description: Internal server error
 */
router.get('/:booking_id', commentController.getCommentList);

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get Comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the comment to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment found
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', commentController.getCommentById);

/**
 * @swagger
 * /comment/addComment:
 *   post:
 *     summary: Add a new comment with optional image
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *               comment:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/addComment', upload.single('image'), commentController.addComment);

/**
 * @swagger
 * /comment/editComment/{id}:
 *   put:
 *     summary: Edit a comment
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the comment to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put('/editComment/:id', commentController.editComment);

/**
 * @swagger
 * /comment/deleteComment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteComment/:id', commentController.deleteComment);

module.exports = router;
