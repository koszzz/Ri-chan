import { ws } from "../bot.js";
import getAction from "../getAction.js";

import rockPaperScissors from "./rockPaperScissors.js";
import shoot from "./shoot.js";

export default () => {
    ws.on("PUBLIC_GUILD_MESSAGES", (data) => {
        if (data.eventType == "AT_MESSAGE_CREATE") {
            const author = data.msg.author.id;
            const msg_id = data.msg.id;
            const channel_id = data.msg.channel_id;
            const content = data.msg.content;
            const guildId = data.msg.guild_id;

            const action = getAction(content, "guild");
            if (action == "猜拳") {
                rockPaperScissors(msg_id, channel_id, author, "guild", guildId);
            } else if (["石头", "剪刀", "布"].includes(action)) {
                shoot(msg_id, channel_id, author, action, "guild", guildId);
            }
        }
    });
    ws.on("GROUP_AND_C2C_EVENT", (data) => {
        if (data.eventType == "GROUP_AT_MESSAGE_CREATE") {
            const author = data.msg.author.member_openid;
            const msg_id = data.msg.id;
            const group_id = data.msg.group_openid;
            const content = data.msg.content;
            const action = getAction(content, "group");
            if (action == "猜拳") {
                rockPaperScissors(msg_id, group_id, author, "group");
            } else if (["石头", "剪刀", "布"].includes(action)) {
                shoot(msg_id, group_id, author, action, "group");
            }
        }
    });
};
