import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";

async function hello(msg_id, channel_id, author) {
    callWithRetry(postMessage, [channel_id, {
        content: `<@!${author}> 你好呀宝子！小鲤在的！随时可以“/看鲤”嗷~`,
        msg_id,
        image: 'https://cdn.liyuu.ceek.fun/images/shy.jpg' //羞涩
    }, (res => {
        console.log(res.data)
    })]);
}

export default hello