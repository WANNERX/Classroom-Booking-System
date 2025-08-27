const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // กำหนดให้เป็น Primary Key
        autoIncrement: true, // ให้เพิ่มค่าทีละ 1 อัตโนมัติ
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        unique: true,
    },
}, {
    tableName: 'users', // ชื่อตารางในฐานข้อมูล
    timestamps: false,
});

module.exports = User;
