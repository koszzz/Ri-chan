import { ws } from "../bot.js";
import getAction from "../getAction.js";

import randomNumber from "./randomNumber.js";

export default () => {
    ws.on("PUBLIC_GUILD_MESSAGES", (data) => {
        if (data.eventType == "AT_MESSAGE_CREATE") {
            const author = data.msg.author.id;
            const msg_id = data.msg.id;
            const channel_id = data.msg.channel_id;
            const content = data.msg.content;

            if (getAction(content) == "randomNumber") {
                const regex = /\d+d\d+/;
                const XdY = content.match(regex) ? content.match(regex)[0] : 0;
                randomNumber(msg_id, channel_id, author, XdY);
            }
        }
    });
};
