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
            const authorName = data.msg.author.username;
            const msg_id = data.msg.id;
            const channel_id = data.msg.channel_id;
            const timestamp = data.msg.timestamp;
            const content = data.msg.content;
            const guildId = data.msg.guild_id;

            switch (getAction(content, "guild")) {
                case "结束看鲤":
                    stopWatching(msg_id, channel_id, author, guildId, "guild");
                    break;
                case "看鲤":
                    meetLiyuu(
                        msg_id,
                        channel_id,
                        author,
                        timestamp,
                        guildId,
                        "guild"
                    );
                    break;
                case "查看积分":
                    queryPoints(
                        msg_id,
                        channel_id,
                        author,
                        authorName,
                        guildId,
                        "guild"
                    );
                    break;
                case "hello":
                    hello(msg_id, channel_id, author, "guild");
                    break;
            }
        }
    });
    ws.on("GROUP_AND_C2C_EVENT", (data) => {
        if (data.eventType == "GROUP_AT_MESSAGE_CREATE") {
            const author = data.msg.author.member_openid;
            const authorName = "您";
            const msg_id = data.msg.id;
            const group_id = data.msg.group_openid;
            const content = data.msg.content;
            const timestamp = data.msg.timestamp;

            switch (getAction(content, "group")) {
                case "结束看鲤":
                    stopWatching(msg_id, group_id, author, group_id, "group");
                    break;
                case "看鲤":
                    meetLiyuu(
                        msg_id,
                        group_id,
                        author,
                        timestamp,
                        group_id,
                        "group"
                    );
                    break;
                case "查看积分":
                    queryPoints(
                        msg_id,
                        group_id,
                        author,
                        authorName,
                        group_id,
                        "group"
                    );
                    break;
                case "hello":
                    hello(msg_id, group_id, author, "group");
                    break;
            }
        }
    });
};
