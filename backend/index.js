require('dotenv').config();
const express = require('express');
const cors = require('cors'); // เรียกใช้ cors
const detectPort = require('detect-port').default; // ✅ กรณีที่ใช้ ES module export
const userRoutes = require('./routes/userRoutes'); // เรียกใช้เส้นทางผู้ใช้จาก routes/userRoutes.js
const buildingRoutes = require('./routes/buildingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingsRoutes = require('./routes/bookingRoutes'); // เรียกใช้เส้นทางการจอง
const commentRoutes = require('./routes/commentRoutes')
const setupSwagger = require('./config/swagger'); // เรียกใช้การตั้งค่า Swagger
const sequelize = require('./config/db');

const app = express();

// ใช้งาน middleware cors
app.use(cors());

// ใช้งาน middleware เพื่ออ่าน JSON body
app.use(express.json());

// ใช้งานเส้นทางผู้ใช้
app.use('/users', userRoutes);

// ใช้งานเส้นทางตึก
app.use('/building', buildingRoutes);

// ใช้งานเส้นทางห้อง
app.use('/rooms', roomRoutes);

// ใช้งานเส้นทางการจอง
app.use('/booking', bookingsRoutes);

// ใช้งานเส้นทางแสดงความคิดเห็น
app.use('/comment', commentRoutes);

// path รูป
app.use('/uploads', express.static('uploads'));

// ตั้งค่า Swagger
setupSwagger(app);

// สร้าง API endpoint เบื้องต้น
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

sequelize.sync({ force: false }) // ใช้ { force: true } หากต้องการรีเซ็ตตาราง
    .then(() => console.log('All models synchronized successfully.'))
    .catch(err => console.error('Error synchronizing models:', ));

// เริ่มเซิร์ฟเวอร์
const PORT = Number(process.env.PORT);

detectPort(PORT).then((freePort) => {
    if (freePort=== PORT) {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } else {
        console.error(`Port ${PORT} is in use. Please stop the application using it or try a different port.`);
    }
}).catch((err) => {
    console.error('Error detecting port:', err);
});
