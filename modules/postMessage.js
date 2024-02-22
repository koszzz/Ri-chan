import { client } from "./bot.js";

/**
 * 发送消息
 * @param {string} destinationId 发送目标地id（group_id, channel_id, 私信guild_id）
 * @param {Object} message 消息体
 * @param {Function} func 发送完成后执行的函数
 * @param {string=} type 发送类型，可选"guild"（频道）/"group"（群聊）/"direct"（频道私信），默认"guild"
 */
async function postMessage(destinationId, message, func, type = "guild") {
    if (!["guild", "group", "direct"].includes(type)) {
        throw "发送类型不正确";
    }
    const apis = {
        guild: (destinationId, message) => {
            return client.messageApi.postMessage(destinationId, message);
        },
        group: (destinationId, message) => {
            return client.groupApi.postMessage(destinationId, message);
        },
        direct: (destinationId, message) => {
            return client.directMessageApi.postDirectMessage(
                destinationId,
                message
            );
        },
    };
    await apis[type](destinationId, message)
        .then(func)
        .catch((err) => {
            if (JSON.stringify(err) != "{}") {
                throw err;
            }
        });
}

export default postMessage;
