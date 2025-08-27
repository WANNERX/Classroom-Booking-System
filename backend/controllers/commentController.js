const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const fs = require('fs');
const path = require('path');

// Controller : ดึงข้อมูลการ Comment ทั้งหมด ตาม booking_id
exports.getCommentList = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: Token not found' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', error: 'Token has expired' });
        }
        return res.status(401).json({ status: 'error', error: 'Invalid or expired token' });
    }

    const userId = decoded.user_id || decoded.id;
    if (!userId) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: User ID not found in token' });
    }

    try {
        const { booking_id } = req.params; // ดึง booking_id จาก params

        // ✅ ใช้ Sequelize: Comment.findAll() แล้ว filter ด้วย booking_id
        const comments = await Comment.findAll({
            where: { booking_id },
            order: [['comment_id', 'DESC']]
        });
        

        res.status(200).json({ status: 'success', data: comments, message: 'Comment Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller : ดึง Comment ตาม ID
exports.getCommentById = async (req, res) => {// ✅ ดึง token มาจาก headers เพื่อตรวจสอบตัวตน
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: Token not found' });
    }

    let decoded;
    try {
        // ✅ decode และ verify token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', error: 'Token has expired' }); // Token หมดอายุ
        }
        return res.status(401).json({ status: 'error', error: 'Invalid or expired token' }); // Token ไม่ถูกต้อง
    }

    const userId = decoded.user_id || decoded.id; // เอา user_id หรือ id ที่ได้จาก token
    // ✅ ถ้าไม่มี userId ถือว่าไม่ผ่าน
    if (!userId) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: User ID not found in token' });
    }
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ status: 'error', error: 'Comment not found' });
        }
        res.status(200).json({ status: 'success', data: comment });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller : เพิ่ม Comment ใหม่
exports.addComment = async (req, res) => {
    // ✅ ดึง token มาจาก headers เพื่อตรวจสอบตัวตน
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: Token not found' });
    }

    let decoded;
    try {
        // ✅ decode และ verify token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', error: 'Token has expired' }); // Token หมดอายุ
        }
        return res.status(401).json({ status: 'error', error: 'Invalid or expired token' }); // Token ไม่ถูกต้อง
    }

    const userId = decoded.user_id || decoded.id; // เอา user_id หรือ id ที่ได้จาก token
    // ✅ ถ้าไม่มี userId ถือว่าไม่ผ่าน
    if (!userId) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: User ID not found in token' });
    }
    try {
        const { booking_id, comment } = req.body;
        const image_path = req.file ? `/uploads/comments/${req.file.filename}` : null;

        const newComment = await Comment.create({
            booking_id,
            user_id: userId,
            comment,
            image_path,
        });

        res.status(201).json({ status: 'success', data: newComment });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller : แก้ไข Comment ตาม ID ไม่ได้ใช้
exports.editComment = async (req, res) => {
    // ✅ ดึง token มาจาก headers เพื่อตรวจสอบตัวตน
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: Token not found' });
    }

    let decoded;
    try {
        // ✅ decode และ verify token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', error: 'Token has expired' }); // Token หมดอายุ
        }
        return res.status(401).json({ status: 'error', error: 'Invalid or expired token' }); // Token ไม่ถูกต้อง
    }

    const userId = decoded.user_id || decoded.id; // เอา user_id หรือ id ที่ได้จาก token
    // ✅ ถ้าไม่มี userId ถือว่าไม่ผ่าน
    if (!userId) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: User ID not found in token' });
    }
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const commentRecord = await Comment.findByPk(id);
        if (!commentRecord) {
            return res.status(404).json({ status: 'error', error: 'Comment not found' });
        }

        commentRecord.comment = comment || commentRecord.comment;

        await commentRecord.save();

        res.status(200).json({ status: 'success', data: commentRecord });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller : ลบ Comment ตาม ID
exports.deleteComment = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: Token not found' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', error: 'Token has expired' });
        }
        return res.status(401).json({ status: 'error', error: 'Invalid or expired token' });
    }

    const userId = decoded.user_id || decoded.id;
    if (!userId) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized: User ID not found in token' });
    }

    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ status: 'error', error: 'Comment not found' });
        }

        // ✅ ลบรูปภาพถ้ามี
        if (comment.image_path) {
            const imagePath = path.join(__dirname, '..', comment.image_path);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    console.log('Deleted image:', imagePath);
                }
            });
        }

        await comment.destroy();

        res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};
