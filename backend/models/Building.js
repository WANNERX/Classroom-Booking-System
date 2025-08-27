const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Building = sequelize.define('Building', {
    building_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // กำหนดให้เป็น Primary Key
        autoIncrement: true, // ให้เพิ่มค่าทีละ 1 อัตโนมัติ
    },
    building_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    building_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    building_path_img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'building', // ชื่อตารางในฐานข้อมูล
    timestamps: false,
});

module.exports = Building;
