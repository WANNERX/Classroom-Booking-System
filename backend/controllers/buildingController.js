const Building = require('../models/Building');
// Controller สำหรับดึงข้อมูลทั้งหมด
exports.getBuildings = async (req, res) => {
    try {
        // ใช้ Model building เพื่อดึงข้อมูลผู้ใช้ทั้งหมด
        const buildings = await Building.findAll(); // คืนค่าผู้ใช้ทั้งหมดในฐานข้อมูล
        res.status(200).json({ status: 'success', data: buildings });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};


