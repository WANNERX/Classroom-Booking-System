const bcrypt = require('bcrypt'); // ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken'); // ใช้ jsonwebtoken สำหรับการสร้าง token
const User = require('../models/User');

// Controller สำหรับดึงข้อมูลผู้ใช้
exports.getUsers = async (req, res) => {
    try {
        // ใช้ Model User เพื่อดึงข้อมูลผู้ใช้ทั้งหมด
        const users = await User.findAll(); // คืนค่าผู้ใช้ทั้งหมดในฐานข้อมูล
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller สำหรับการดึงข้อมูลผู้ใช้ตาม ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id; // รับ userId จาก params ของ request
    console.log("User ID from request:", userId); // แสดง userId ที่ได้รับจาก request
    try {
        // ค้นหาผู้ใช้ในฐานข้อมูลตาม ID
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found.' });
        }
        res.status(200).json({ status: 'success', data: user });
    }
    catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller สำหรับการลบผู้ใช้
exports.deleteUser = async (req, res) => {
    const Id  = req.params.id; // รับ userId จาก body ของ request
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
        // ลบผู้ใช้จากฐานข้อมูล
        await User.destroy({ where: { user_id: Id } });
        res.status(200).json({ status: 'success', message: 'User deleted successfully!' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller สำหรับการลงทะเบียนผู้ใช้
exports.registerUser = async (req, res) => {
    const { username, fullname, email, password, tel } = req.body;

    if (!username || !fullname || !email || !password || !tel) {
        return res.status(400).json({ status: 'error', error: 'Please provide all required fields.' });
    }

    try {
        // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'Email already exists.' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้างผู้ใช้ใหม่
        const newUser = await User.create({
            user_name: username,
            email,
            fullname,
            password: hashedPassword,
            tel,
        });

        res.status(201).json({ status: 'success', message: 'User registered successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// Controller สำหรับการเข้าสู่ระบบผู้ใช้
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'error', error: 'Please provide both email and password.' });
    }

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้อีเมล
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ status: 'error', error: 'Invalid email or password.' });
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', error: 'Invalid email or password.' });
        }

        // สร้าง token สำหรับผู้ใช้ (เปลี่ยนจาก id เป็น user_id)
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully!',
            token,
            username: user.user_name,
            role: user.role,
            fullname: user.fullname,
            uid: user.user_id
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};
// Controller สำหรับการออกจากระบบผู้ใช้
exports.logoutUser = (req, res) => {
    // สำหรับการออกจากระบบ, เราสามารถทำลาย token บน frontend หรือทำเป็น blacklist ใน backend
    // ตัวอย่างนี้เพียงแค่ตอบกลับว่าผู้ใช้ได้ออกจากระบบเรียบร้อยแล้ว

    res.status(200).json({ status: 'success', message: 'User logged out successfully!' });
};

// Controller สำหรับการรีเซ็ตรหัสผ่านผู้ใช้
exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ status: 'error', error: 'Please provide both email and new password.' });
    }

    try {
        const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'
        console.log("Token from request:", token);
        if (!token) {
            return res.status(401).json({ status: "error", error: "Unauthorized: Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;

        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) {
            return res.status(404).json({ status: "error", error: "ไม่พบผู้ใช้" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ status: "success", message: "รีเซ็ตรหัสผ่านสำเร็จ!" });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ status: "error", error: "Invalid token signature." });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ status: "error", error: "Token has expired." });
        }
        res.status(500).json({ status: "error", error: error.message });
    }
};

// Controller สำหรับการแก้ไขข้อมูลผู้ใช้ (Admin-only)
exports.editUser = async (req, res) => {
    const { username, fullname, email, tel, password, role } = req.body;
    const { id } = req.params; // id ของ user ที่จะถูกแก้ไข

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
        // หา user ที่จะอัปเดต
        const user = await User.findOne({ where: { user_id: id } });
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        // ถ้ามี password ใหม่ -> hash ใหม่
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // อัปเดตข้อมูลใหม่
        if (username) user.user_name = username;
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (tel) user.tel = tel;
        if (role) user.role = role;

        await user.save();

        res.status(200).json({ status: 'success', message: 'User updated successfully', user });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ status: "error", error: "Invalid token signature." });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ status: "error", error: "Token has expired." });
        }
        res.status(500).json({ status: 'error', error: error.message });
    }
};
