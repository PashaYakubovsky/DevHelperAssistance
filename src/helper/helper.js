// const { replicateApiToken } = require("../../config.json");
const replicateApiToken = "c25e53cda1c3b9be1d83ec33dcebedc015a5d643";
const axios = require("axios");

module.exports = {
    replicateStartHandler: async function ({ prompt }) {
        const response = await axios.post(
            "https://api.replicate.com/v1/predictions",
            {
                // Pinned to a specific version of Stable Diffusion
                // See https://replicate.com/stability-ai/stable-diffussion/versions
                version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",

                // This is the text prompt that will be submitted by a form on the frontend
                input: { prompt },
            },
            {
                headers: {
                    Authorization: "Token c25e53cda1c3b9be1d83ec33dcebedc015a5d643",
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    },
    replicateEndHandler: async function (id) {
        const response = await axios.get("https://api.replicate.com/v1/predictions/" + id, {
            headers: {
                Authorization: "Token c25e53cda1c3b9be1d83ec33dcebedc015a5d643",
                "Content-Type": "application/json",
            },
        });

        return response.data;
    },
};