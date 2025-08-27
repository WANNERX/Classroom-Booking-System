const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increments
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    create_date: {
        type: DataTypes.STRING,
        allowNull: true,
    },    
}, {
    tableName: 'comment',
    timestamps: false,
});

module.exports = Comment;