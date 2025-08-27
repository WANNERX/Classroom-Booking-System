const BASE_URL = "http://localhost:3000";

// api ที่ใช้ในระบบนี้จะมีการส่ง token ไปใน header ด้วย
// แต่พวก api ที่ไม่ต้องการ token ก็พวก getBookingList, getBuildingList, getRoomList, getUserList
// token จะถูกเก็บใน localStorage ของ browser และมันจะสำคัญมากเวลาเอาเรียก api ทีท่ละเอียดอ่อน เช่น add, edit, delete
// ส่วนใหญ่เส้นที่เอาไว้เรียกดูข้อมูลไม่ต้องใช้token ก็ได้เพราะมันไม่ได้สำคัญเหมือนต้องเพิ่มลบแก้ไขข้อมูล 

const API = {
    // api เกี่ยวกับการจองห้อง🔥
    getBookingList: `${BASE_URL}/booking`, // เสร้จแล้วหลังบ้าน ✅ แล้วแต่หน้าบ้านจะเอาไปใช้
    getBookingById: `${BASE_URL}/booking`, // เสร้จแล้วหลังบ้าน ✅ แล้วแต่หน้าบ้านจะเอาไปใช้
    addBooking: `${BASE_URL}/booking/addBooking`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅ จอง
    editBooking: `${BASE_URL}/booking/editBooking`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅ แก้ไขจอง
    deleteBooking: `${BASE_URL}/booking/deleteBooking`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅ ลบจอง

    // api เกี่ยวกับการแสดงความคิด🔥
    getComment: `${BASE_URL}/comment`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    getCommentById: `${BASE_URL}/comment/getComment`, // มีแล้วแต่ไม่ได้ใช้ ปกติจะใช้สำหรับค้นหาข้อมูลมาแสดงตอนแก้ไข แต่ไม่มีแก้ไข
    addComment: `${BASE_URL}/comment/addComment`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    editComment: `${BASE_URL}/comment/editComment`, // ไม่ให้แก้ ให้ลบแล้วคอมเม้นใหม่มาแทนจบ
    deleteComment: `${BASE_URL}/comment/deleteComment`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅

    // api เกี่ยวกับการจัดการตึก🔥
    getBuildingList: `${BASE_URL}/building`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅

    // api เกี่ยวกับการจัดการห้องเรียน🔥
    getRoomList: `${BASE_URL}/rooms`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    getRoomById: `${BASE_URL}/rooms`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    addRoom: `${BASE_URL}/rooms/addRoom`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    editRoom: `${BASE_URL}/rooms/editRoom`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    deleteRoom: `${BASE_URL}/rooms/deleteRoom`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅

    // api เกี่ยวกับการจัดการผู้ใช้🔥
    getUserList: `${BASE_URL}/users`, // เสร้จแล้วหลังบ้าน ✅ แล้วแต่หน้าบ้านจะเอาไปใช้
    getUserById: `${BASE_URL}/users`, // เสร้จแล้วหลังบ้าน ✅ แล้วแต่หน้าบ้านจะเอาไปใช้
    regiser: `${BASE_URL}/users/register`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    login: `${BASE_URL}/users/login`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    logout: `${BASE_URL}/users/logout`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    resetPassword: `${BASE_URL}/users/resetPassword`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    deleteUser: `${BASE_URL}/users/deleteUser`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
    editUser: `${BASE_URL}/users/editUser`, // เสร้จแล้วทั้งหน้าบ้านและหลังบ้าน ✅
};

export default API;
