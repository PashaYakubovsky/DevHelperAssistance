const https = require("https");
const axios = require("axios");

const httpAgent = new https.Agent({
    rejectUnauthorized: false,
    
});

module.exports = {
    api: axios.create({ httpAgent }),
};
