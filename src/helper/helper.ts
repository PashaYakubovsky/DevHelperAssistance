export const splitTextIntoChunks = function (
    text: string,
    maxLength = 1024
): { name: string; value: string }[] {
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
    } else {
        chunks.push({
            name: "ノ( º _ ºノ)",
            value: text,
        });
    }

    return chunks;
};
