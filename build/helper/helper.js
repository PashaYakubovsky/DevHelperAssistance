"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTextIntoChunks = void 0;
const splitTextIntoChunks = function (text, maxLength = 1024) {
    const chunks = [];
    const length = text.length;
    // let stepEmoji = "ノ( º _ ºノ)";
    let stepEmoji = "\n";
    if (length > maxLength) {
        for (let i = 0; i < length; i += maxLength) {
            const chunk = text.substring(i, i + maxLength);
            const chunkObject = {
                name: stepEmoji,
                value: chunk,
            };
            stepEmoji = "\n" + stepEmoji;
            chunks.push(chunkObject);
        }
    }
    else {
        chunks.push({
            name: "ノ( º _ ºノ)",
            value: text,
        });
    }
    return chunks;
};
exports.splitTextIntoChunks = splitTextIntoChunks;
