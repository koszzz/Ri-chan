import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import {
    getAllowedChannelId,
    pushAllowedChannelId,
    canncelAllowedChannelId,
} from "./publicApi.js";

async function setGoodMorning(
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
                content: `<@!${author}> 宝子~已经设置好每天早上8:00在<#${channel_id}>说早安啦~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/sportGood.png", // 体育赞
            },
            async (res) => {
                // 获取早安子频道列表
                const goodMorningChannelId = await getAllowedChannelId(
                    guild_id,
                    "goodMorning"
                );
                // 如果子频道还没有被添加过
                if (
                    goodMorningChannelId.filter(
                        (i) => i.channel_id == channel_id
                    ).length == 0
                ) {
                    await pushAllowedChannelId(
                        channel_id,
                        guild_id,
                        "goodMorning"
                    );
                }
                console.log(res.data);
            },
        ]);
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~只有频道主和管理员才能设置早安哦~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/kiss.png", //亲亲
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

async function cancelGoodMorning(
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
        const goodMorningChannelId = await getAllowedChannelId(
            guild_id,
            "goodMorning"
        );
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~已经取消掉了在<#${channel_id}>说早安~\n现在${
                    goodMorningChannelId
                        .filter((i) => i.channel_id != channel_id)
                        .map((i) => `<#${i.channel_id}>`)
                        .join("") == ""
                        ? "没有子频道"
                        : "有" +
                          goodMorningChannelId
                              .filter((i) => i.channel_id != channel_id)
                              .map((i) => `<#${i.channel_id}>`)
                              .join("")
                }每天说早安~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/wara.jpg", //黑色T憨笑
            },
            async (res) => {
                await canncelAllowedChannelId(channel_id, "goodMorning");
                console.log(res.data);
            },
        ]);
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~只有频道主和管理员才能取消早安哦~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/kiss.png", //亲亲
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

async function viewGoodMorning(msg_id, channel_id, author, guild_id) {
    const goodMorningChannelId = await getAllowedChannelId(
        guild_id,
        "goodMorning"
    );
    callWithRetry(postMessage, [
        channel_id,
        {
            content: `<@!${author}> 宝子~现在${
                goodMorningChannelId
                    .map((i) => `<#${i.channel_id}>`)
                    .join("") == ""
                    ? "没有子频道"
                    : "有" +
                      goodMorningChannelId
                          .map((i) => `<#${i.channel_id}>`)
                          .join("")
            }每天说早安~`,
            msg_id,
            image: "https://cdn.liyuu.ceek.fun/images/kiss.png", //亲亲
        },
        (res) => {
            console.log(res.data);
        },
    ]);
}

export { setGoodMorning, cancelGoodMorning, viewGoodMorning };
