import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import {
    getAllowedChannelId,
    pushAllowedChannelId,
    canncelAllowedChannelId,
} from "./publicApi.js";

async function setMeetLiyuu(
    msg_id,
    channel_id,
    author,
    limits_of_authority,
    guild_id
) {
    // 如果是频道主4或者管理员2
    if (
        limits_of_authority.includes("2") ||
        limits_of_authority.includes("4")
    ) {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~已经设置可以在<#${channel_id}>看鲤啦~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/sportGood.png", // 体育赞
            },
            async (res) => {
                const meetLiyuuChannelId = await getAllowedChannelId(
                    guild_id,
                    "meetLiyuu"
                );
                if (
                    meetLiyuuChannelId.filter((i) => i.channel_id == channel_id)
                        .length == 0
                ) {
                    await pushAllowedChannelId(
                        channel_id,
                        guild_id,
                        "meetLiyuu"
                    );
                }
                console.log(res.data);
            },
        ]);
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~只有频道主和管理员才能设置看鲤子频哦~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/kiss.png", //亲亲
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

async function cancelMeetLiyuu(
    msg_id,
    channel_id,
    author,
    limits_of_authority,
    guild_id
) {
    // 如果是频道主4或者管理员2
    if (
        limits_of_authority.includes("2") ||
        limits_of_authority.includes("4")
    ) {
        const meetLiyuuChannelId = await getAllowedChannelId(
            guild_id,
            "meetLiyuu"
        );
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~已经取消掉了在<#${channel_id}>看鲤~\n现在${
                    meetLiyuuChannelId.filter((i) => i.channel_id != channel_id)
                        .length == 0
                        ? "没有子频道"
                        : "有" +
                          meetLiyuuChannelId
                              .filter((i) => i.channel_id != channel_id)
                              .map((i) => `<#${i.channel_id}>`)
                              .join("")
                }可以看鲤~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/wara.jpg", //黑色T憨笑
            },
            async (res) => {
                await canncelAllowedChannelId(channel_id, "meetLiyuu");
                console.log(res.data);
            },
        ]);
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~只有频道主和管理员才能取消看鲤子频哦~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/kiss.png", //亲亲
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

async function viewMeetLiyuu(msg_id, channel_id, author, guild_id) {
    const meetLiyuuChannelId = await getAllowedChannelId(guild_id, "meetLiyuu");
    callWithRetry(postMessage, [
        channel_id,
        {
            content: `<@!${author}> 宝子~现在${
                meetLiyuuChannelId.map((i) => `<#${i.channel_id}>`).join("") ==
                ""
                    ? "没有子频道"
                    : "有" +
                      meetLiyuuChannelId
                          .map((i) => `<#${i.channel_id}>`)
                          .join("")
            }可以看鲤~`,
            msg_id,
            image: "https://cdn.liyuu.ceek.fun/images/kiss.png", //亲亲
        },
        (res) => {
            console.log(res.data);
        },
    ]);
}

export { setMeetLiyuu, cancelMeetLiyuu, viewMeetLiyuu };
