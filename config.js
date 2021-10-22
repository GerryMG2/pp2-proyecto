const dotenv = require('dotenv');
dotenv.config();

configuraciones = {
    URI_MONGO: process.env.URI_MONGO,
    URL: process.env.URL
};

module.exports = configuraciones;