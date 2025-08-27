const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Classroom Booking System'
        },
        servers: [
            {
                url: 'http://localhost:3000', // เปลี่ยน URL ตามที่โปรเจคของคุณใช้งาน
            },
        ],
        tags: [
            {
                name: 'Users',
                description: 'Operations about users'
            },
            {
                name: 'Building',
                description: 'Operations about building'
            },
            {
                name: 'Rooms',
                description: 'Operations about rooms'
            }
            
        ]
        
    },
    apis: ['./routes/*.js'], // กำหนดตำแหน่งไฟล์ที่มีการกำหนดเส้นทาง API
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
