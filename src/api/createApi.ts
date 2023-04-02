import { AxiosStatic } from "axios";
import https from "https";
import axios from "axios";

const httpAgent = new https.Agent({
    rejectUnauthorized: false,
});

module.exports = {
    api: (axios as AxiosStatic).create({ httpAgent }),
};
