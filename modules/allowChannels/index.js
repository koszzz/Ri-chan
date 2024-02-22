import { ws } from "../bot.js";
import getAction from "../getAction.js";

import { setMeetLiyuu, cancelMeetLiyuu, viewMeetLiyuu } from "./meetLiyuu.js";
import {
    setGoodMorning,
    cancelGoodMorning,
    viewGoodMorning,
} from "./goodMorning.js";
import { pushAllowedChannelId, canncelAllowedChannelId } from "./publicApi.js";

export default () => {
    ws.on("PUBLIC_GUILD_MESSAGES", (data) => {
        if (data.eventType == "AT_MESSAGE_CREATE") {
            const author = data.msg.author.id;
            const msg_id = data.msg.id;
            const channel_id = data.msg.channel_id;
            const content = data.msg.content;
            const limits_of_authority = data.msg.member.roles;
            const guildId = data.msg.guild_id;

            switch (getAction(content)) {
                case "设置看鲤子频":
                    setMeetLiyuu(
                        msg_id,
                        channel_id,
                        author,
                        limits_of_authority,
                        guildId
                    );
                    break;
                case "取消看鲤子频":
                    cancelMeetLiyuu(
                        msg_id,
                        channel_id,
                        author,
                        limits_of_authority,
                        guildId
                    );
                    break;
                case "查看看鲤子频":
                    viewMeetLiyuu(msg_id, channel_id, author, guildId);
                    break;
                case "设置早安":
                    setGoodMorning(
                        msg_id,
                        channel_id,
                        author,
                        limits_of_authority,
                        guildId
                    );
                    break;
                case "取消早安":
                    cancelGoodMorning(
                        msg_id,
                        channel_id,
                        author,
                        limits_of_authority,
                        guildId
                    );
                    break;
                case "查看早安子频":
                    viewGoodMorning(msg_id, channel_id, author, guildId);
                    break;
            }
        }
    });
    ws.on("GROUP", (data) => {
        if (data.eventType == "GROUP_ADD_ROBOT") {
            const group_id = data.msg.group_openid;
            pushAllowedChannelId(group_id, null, null, "goodMorning");
            console.log("加入群聊");
        } else if (data.eventType == "GROUP_DEL_ROBOT") {
            const group_id = data.msg.group_openid;
            canncelAllowedChannelId(null, "goodMorning", group_id);
            console.log("退出群聊");
        }
    });
};
