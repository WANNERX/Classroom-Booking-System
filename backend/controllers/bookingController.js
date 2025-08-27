const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const cron = require('node-cron');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc); // ✅ เปิดใช้งาน plugin utc ของ dayjs เพื่อให้จัดการเวลาที่เป็น UTC ได้ถูกต้อง

// Controller : ดึงข้อมูลการจองทั้งหมด
exports.getBookingList = async (req, res) => {
    try {
        const bookings = await Booking.findAll(); // ดึงข้อมูลการจองทั้งหมดจาก database
        res.status(200).json({ status: 'success', data: bookings }); // ส่งกลับในรูปแบบ JSON
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message }); // หากมี error เกิดขึ้น
    }
};

// Controller : ค้นหาการจองด้วย booking_id
exports.getBookingById = async (req, res) => {
    const bookingId = req.params.id; // ดึง booking_id จากพารามิเตอร์ URL เช่น /booking/33

    try {
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

        const booking = await Booking.findByPk(bookingId); // ค้นหา booking ด้วย Primary Key

        if (!booking) {
            // ถ้าไม่เจอ booking
            return res.status(404).json({ status: 'error', error: 'Booking not found.' });
        }

        // ถ้าเจอ booking ส่งกลับข้อมูล
        res.status(200).json({ status: 'success', data: booking });
    } catch (error) {
        // กรณีเกิดข้อผิดพลาดอื่น ๆ เช่น database ล่ม
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller : จองห้องใหม่
exports.addBooking = async (req, res) => {
    const { building_code, room_code, start_date, end_date, booker_name, user_id } = req.body;

    // ✅ เช็คว่าทุกฟิลด์ที่จำเป็นต้องส่งมาครบไหม
    if (!building_code || !room_code || !start_date || !end_date || !booker_name || !user_id) {
        return res.status(400).json({ status: 'error', error: 'Please provide all required fields.' });
    }

    const now = dayjs().utc(); // เวลาปัจจุบันในรูปแบบ UTC
    const startDate = dayjs(start_date).utc(); // แปลง start_date เป็น dayjs utc
    const endDate = dayjs(end_date).utc(); // แปลง end_date เป็น dayjs utc

    // ✅ เช็คว่า start_date ต้องมากกว่าหรือเท่ากับเวลาปัจจุบัน (ห้ามจองย้อนหลัง)
    if (startDate.isBefore(now)) {
        return res.status(400).json({ status: 'error', error: 'Cannot book a room in the past.' });
    }

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
        // ✅ เช็คว่าช่วงเวลาที่จองใหม่ ทับกับที่มีอยู่ในระบบหรือไม่
        const overlapBooking = await Booking.findOne({
            where: {
                building_code,
                room_code,
                [Op.or]: [
                    { start_date: { [Op.between]: [start_date, end_date] } }, // จองใหม่ start อยู่ระหว่างช่วงที่มีอยู่
                    { end_date: { [Op.between]: [start_date, end_date] } },   // จองใหม่ end อยู่ระหว่างช่วงที่มีอยู่
                    {
                        [Op.and]: [ // หรือ จองใหม่ครอบทั้งช่วง
                            { start_date: { [Op.lte]: start_date } },
                            { end_date: { [Op.gte]: end_date } },
                        ],
                    },
                ],
            },
        });

        if (overlapBooking) {
            return res.status(400).json({ status: 'error', error: 'Room is already booked for the selected time range.' });
        }

        // ✅ ถ้าไม่ทับกัน สร้าง booking ใหม่
        const newBooking = await Booking.create({
            building_code,
            room_code,
            start_date,
            end_date,
            booker_name,
            user_id,
        });

        res.status(201).json({ status: 'success', message: 'Booking Successful!', booking: newBooking });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message }); // Error อื่น ๆ
    }
};


// Controller : แก้ไขการจองห้อง
exports.editBooking = async (req, res) => {
    const bookingId = req.params.id; // ดึง booking_id จาก params
    const { building_code, room_code, start_date, end_date, booker_name, user_id } = req.body; // ดึงข้อมูลจาก body

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
        const booking = await Booking.findByPk(bookingId); // ค้นหา booking ตาม id
        if (!booking) {
            return res.status(404).json({ status: 'error', error: 'Booking not found.' }); // ถ้าไม่พบ booking
        }

        // ✅ อัพเดตข้อมูล booking
        booking.building_code = building_code || booking.building_code;
        booking.room_code = room_code || booking.room_code;
        booking.start_date = start_date || booking.start_date;
        booking.end_date = end_date || booking.end_date;
        booking.booker_name = booker_name || booking.booker_name;
        booking.user_id = user_id || booking.user_id
        await booking.save(); // บันทึกการเปลี่ยนแปลงลง database

        res.status(200).json({ status: 'success', message: 'Booking updated successfully.', data: booking });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message }); // Error อื่น ๆ
    }
};

// Controller : ลบการจองห้อง
exports.deleteBooking = async (req, res) => {
    const bookingId = req.params.id; // ดึง booking_id จาก params

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
        const booking = await Booking.findByPk(bookingId); // ค้นหา booking ตาม id
        if (!booking) {
            return res.status(404).json({ status: 'error', error: 'Booking not found.' }); // ถ้าไม่พบ booking
        }

        await booking.destroy(); // ลบ booking
        res.status(200).json({ status: 'success', message: 'Booking deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message }); // Error อื่น ๆ
    }
};

// ✅ Scheduler : ตั้งเวลาให้ระบบเช็คสถานะ booking ทุกๆ 1 นาที
cron.schedule('* * * * *', async () => {
    console.log('Running booking status update...');

    try {
        const bookings = await Booking.findAll(); // ดึง booking ทั้งหมดมาเช็ค
        const nowTime = dayjs(); // เวลาปัจจุบัน ในรูปแบบ UTC
        const now = nowTime.add(7, "hour"); // เพิ่ม 7 ชั่วโมง

        for (const booking of bookings) {
            const startDate = dayjs(booking.start_date).utc(); // แปลง start_date เป็น dayjs utc
            const endDate = dayjs(booking.end_date).utc(); // แปลง end_date เป็น dayjs utc
            let newStatus = '';

            // ✅ เช็คสถานะ booking จากช่วงเวลา
            if (now.isBefore(startDate)) {
                newStatus = 'ยังไม่เริ่ม'; // ตอนนี้ยังไม่ถึงเวลาเริ่ม

            } else if (now.isAfter(endDate)) {
                newStatus = 'สิ้นสุดแล้ว'; // ตอนนี้เลยเวลาแล้ว
            } else {
                newStatus = 'กำลังใช้งาน'; // ตอนนี้อยู่ระหว่างใช้งาน
            }

            // ✅ ถ้า status เดิมไม่ตรงกับสถานะใหม่ → อัพเดต
            if (booking.status !== newStatus) {
                booking.status = newStatus;
                await booking.save(); // บันทึกลง database
            }
        }

        console.log('Booking statuses updated.');
    } catch (error) {
        console.error('Error updating booking statuses:', error); // ถ้ามี error ตอนอัพเดต
    }
});
