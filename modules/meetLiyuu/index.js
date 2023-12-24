import { ws } from "../bot.js";
import getAction from "../getAction.js";

import meetLiyuu from "./meet.js";
import queryPoints from "./queryPoints.js";
import stopWatching from "./stop.js";
import hello from "./hello.js";

export default () => {
    ws.on("PUBLIC_GUILD_MESSAGES", (data) => {
        if (data.eventType == "AT_MESSAGE_CREATE") {
            const author = data.msg.author.id;
            const msg_id = data.msg.id;
            const channel_id = data.msg.channel_id;
            const timestamp = data.msg.timestamp;
            const content = data.msg.content;
            const guildId = data.msg.guild_id;
            
            switch (getAction(content)) {
                case "结束看鲤":
                    stopWatching(msg_id, channel_id, author, guildId);
                    break;
                case "看鲤":
                    meetLiyuu(msg_id, channel_id, author, timestamp, guildId);
                    break;
                case "查看积分":
                    queryPoints(msg_id, channel_id, author, guildId);
                    break;
                case "hello":
                    hello(msg_id, channel_id, author);
                    break;
            }
        }
    });
};
