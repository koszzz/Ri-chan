import { client } from "./bot.js";

async function postMessage(channel_id, message, func) {
    await client.messageApi
        .postMessage(channel_id, message)
        .then(func)
        .catch((err) => {
            if (JSON.stringify(err) != "{}") {
                throw err;
            }
        });
}

export default postMessage;
