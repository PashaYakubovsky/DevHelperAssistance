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
                input: {
                    adapter_type: "sketch",
                    guidance_scale: 7.5,
                    height: 512,
                    width: 512,
                    lora_scales: "0.5",
                    lora_urls:
                        "https://replicate.delivery/pbxt/tLNfiG3fK2jZo0CrBG4cNTJNhEi7r117ANUBjWrLTkQRMraQA/tmpg9tq4is5me.safetensors",
                    num_inference_steps: 50,
                    num_outputs: 1,
                    prompt,
                    scheduler: "DPMSolverMultistep",
                },
            },
            {
                headers: {
                    Authorization: `Token ${replicateApiToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    },
    replicateEndHandler: async function (id) {
        const response = await axios.get("https://api.replicate.com/v1/predictions/" + id, {
            headers: {
                Authorization: `Token ${replicateApiToken}`,
                "Content-Type": "application/json",
            },
        });

        console.log(response.data);

        return response.data;
    },
};
