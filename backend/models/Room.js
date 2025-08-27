const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // กำหนดให้เป็น Primary Key
        autoIncrement: true, // ให้เพิ่มค่าทีละ 1 อัตโนมัติ
    },
    room_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    building_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'rooms', // ชื่อตารางในฐานข้อมูล
    timestamps: false,
});

module.exports = Room;
