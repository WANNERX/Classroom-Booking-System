const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increments
    },
    building_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    room_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    booker_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    create_date: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ยังไม่เริ่ม'
    },      
}, {
    tableName: 'booking', // Define database table name
    timestamps: false, // Prevent Sequelize from adding `createdAt` and `updatedAt`
});

module.exports = Booking;