const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();

app.use(express.json());
app.use(xss());
app.use(cors());
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

module.exports = app;
