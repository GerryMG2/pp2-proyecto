const dotenv = require('dotenv');
dotenv.config();

configuraciones = {
    URI_MONGO: process.env.URI_MONGO
};

module.exports = configuraciones;