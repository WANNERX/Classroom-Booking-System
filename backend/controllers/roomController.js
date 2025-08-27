const Room = require('../models/Room');
// Controller สำหรับดึงข้อมูลทั้งหมด
exports.getRooms = async (req, res) => {
    try {
        // ใช้ Model building เพื่อดึงข้อมูลผู้ใช้ทั้งหมด
        const rooms = await Room.findAll(); // คืนค่าผู้ใช้ทั้งหมดในฐานข้อมูล
        res.status(200).json({ status: 'success', data: rooms });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// ดึงข้อมูลห้องตาม ID
exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findByPk(id); // หรือ Room.findOne({ where: { room_id: id } });
    if (!room) {
      return res.status(404).json({ status: 'error', error: 'ไม่พบข้อมูลห้อง' });
    }
    res.status(200).json({ status: 'success', data: room });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ✅ Controller: เพิ่มห้องใหม่
exports.addRoom = async (req, res) => {
  const { roomCode, buildingCode } = req.body;

  // ตรวจสอบข้อมูลที่ส่งมา
  if (!roomCode || !buildingCode) {
    return res.status(400).json({ status: 'error', error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const newRoom = await Room.create({
      room_code: roomCode,
      building_code: buildingCode,
    });

    res.status(201).json({
      status: 'success',
      message: 'เพิ่มห้องเรียบร้อยแล้ว',
      data: newRoom,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ✅ แก้ไขข้อมูลห้อง
exports.editRoom = async (req, res) => {
  const { id } = req.params;
  const { roomCode, buildingCode } = req.body;

  if (!roomCode || !buildingCode) {
    return res.status(400).json({ status: 'error', error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ status: 'error', error: 'ไม่พบห้องที่ต้องการแก้ไข' });
    }

    room.room_code = roomCode;
    room.building_code = buildingCode;
    await room.save();

    res.status(200).json({
      status: 'success',
      message: 'แก้ไขข้อมูลห้องเรียบร้อยแล้ว',
      data: room,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// ✅ ลบห้อง
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({ status: 'error', error: 'ไม่พบห้องที่ต้องการลบ' });
    }

    await room.destroy();

    res.status(200).json({
      status: 'success',
      message: 'ลบห้องเรียบร้อยแล้ว',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

