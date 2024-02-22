import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import getFileInfo from "../getFileInfo.js";

async function hello(msg_id, destinationId, author, type = "guild") {
    callWithRetry(postMessage, [
        destinationId,
        {
            content:
                (type == "guild" ? `<@!${author}> ` : "") +
                `你好呀宝子！小鲤在的！随时可以“/看鲤”嗷~`,
            msg_id,
            image:
                type == "guild"
                    ? "https://cdn.liyuu.ceek.fun/images/shy.jpg"
                    : "", //羞涩
            media:
                type == "group"
                    ? await getFileInfo(
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
