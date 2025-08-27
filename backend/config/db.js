const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('classroom_booking_system', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
