import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import { getFileInfo } from "../getFileInfo.js";

/**
 * 获取图片
 * @param {string=} group_id 群聊id，不填返回原始url，填写后返回file_info
 * @param {string} url url
 * @returns {string} file_info或url
 */
const getPicture = async (group_id, url) => {
    if (group_id) {
        const file_info = await getFileInfo(group_id, url);
        if (file_info == "") {
            return await getPicture(group_id);
        }
        return file_info;
    }
    return url;
};

async function hello(msg_id, destinationId, author, type = "guild") {
    callWithRetry(postMessage, [
        destinationId,
        {
            content:
                (type == "guild" ? `<@!${author}> ` : "") +
                `你好呀宝子！小鲤在的！\n我可以为你推送Liyuu图片、与你猜拳${
                    type == "group" ? "、为你唱歌！" : "！"
                }\n欢迎尝试“/看鲤”、“/猜拳”${
                    type == "group" ? "、“/点歌”嗷～" : "嗷～"
                }`,
            msg_id,
            image:
                type == "guild"
                    ? "https://cdn.liyuu.ceek.fun/images/shy.jpg"
                    : "", //羞涩
            media:
                type == "group"
                    ? await getPicture(
                          destinationId,
                          "https://cdn.liyuu.ceek.fun/images/shy.jpg"
                      )
                    : "",
            msg_type: 7,
        },
        (res) => {
            console.log(res.data);
        },
        type,
    ]);
}

export default hello;
