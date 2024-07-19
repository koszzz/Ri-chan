import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import sleep from "../sleep.js";
import dayjs from "dayjs";
import { isInTheAllowedTime } from "../isInTheAllowedTime.js";
// 引入mongodbModels
import {
    meetLiyuuModel,
    dailyOperationsModel,
    imagesModel,
} from "../databaseModels.js";
import { getFileInfo } from "../getFileInfo.js";

// 获取允许看鲤的子频道
import { getAllowedChannelId } from "../allowChannels/publicApi.js";

/**
 * 获取图片
 * @param {string=} group_id 群聊id，不填返回原始url，填写后返回file_info
 * @param {string=} specifyUrl url，不填随机鲤鱼图片
 * @returns {string} file_info或url
 */
const getPicture = async (group_id, specifyUrl) => {
    let url;
    if (specifyUrl) {
        url = specifyUrl;
    } else {
        url = await imagesModel
            .countDocuments()
            .then((count) => {
                const randomIndex = Math.floor(Math.random() * count);
                return imagesModel.findOne().skip(randomIndex).exec();
            })
            .then((res) => res.url)
            .catch((err) => {
                console.log(err);
            });
    }
    if (group_id) {
        const file_info = await getFileInfo(group_id, url);
        if (file_info == "") {
            return await getPicture(group_id);
        }
        return file_info;
    }
    return url;
};

// 看鲤
async function meetLiyuu(
    msg_id,
    destinationId,
    author,
    timestamp,
    guild_id,
    type = "guild"
) {
    if (type == "guild") {
        // 获取允许看鲤的子频道
        const meetLiyuuChannelId = await getAllowedChannelId(
            guild_id,
            "meetLiyuu"
        );
        // 如果当前子频道不允许看鲤
        if (
            meetLiyuuChannelId.findIndex(
                (i) => i.channel_id == destinationId
            ) == -1
        ) {
            callWithRetry(postMessage, [
                destinationId,
                {
                    content: `<@!${author}> 宝子~不能在<#${destinationId}>看鲤哦~\n现在${
                        meetLiyuuChannelId
                            .map((i) => `<#${i.channel_id}>`)
                            .join("") == ""
                            ? "没有子频道"
                            : "有" +
                              meetLiyuuChannelId
                                  .map((i) => `<#${i.channel_id}>`)
                                  .join("")
                    }可以看鲤~${meetLiyuuChannelId
                        .map((i) => `<#${i.channel_id}>`)
                        .join("") == ""?'\n\n如果你是管理员的话，请使用“/设置看鲤子频”指令设置一个子频道用来看鲤吧～':''}`,
                    msg_id,
                    image: "https://cdn.liyuu.ceek.fun/images/dame.jpg", // 摇摇手指大咩哟
                },
                (res) => {
                    console.log(res.data);
                },
                type,
            ]);
            return;
        }
    }

    // 时间限制
    if (
        !isInTheAllowedTime(destinationId) &&
        type == "group"
    ) {
        callWithRetry(postMessage, [
            destinationId,
            {
                content: `\n当前不在可用看鲤时间\n请在北京时间 00:00～09:00、17:00～18:00 来看鲤哦～${
                    destinationId == "DA863706233CF44DCB4B8EE105101591"
                        ? `\n频道看鲤无限制，常回频道看看~（子频道 🤖 | 每日打卡 看鲤）`
                        : ""
                }`,
                msg_id,
                msg_type: 0,
            },
            (res) => {
                console.log(res.data);
            },
            type,
        ]);
        return;
    }

    // 获取看鲤所需时间
    const meetLiyuuTimeout = 5;

    // 获取看鲤次数限制
    const limit = 5;

    // 获取看鲤任务
    const meetLiyuuDbData = await meetLiyuuModel
        .find({
            id: author,
            guild_id: type == "guild" ? guild_id : null,
            group_id: type == "group" ? destinationId : null,
        })
        .then((res) => {
            return res;
        });
    // 目前有看鲤记录
    if (meetLiyuuDbData.length > 0) {
        // 看鲤剩余所需时间
        const leftTime = dayjs(meetLiyuuDbData[0].time)
            .add(meetLiyuuTimeout, "minute")
            .diff(dayjs(), "second");
        // 还未完成观看
        if (leftTime > 0) {
            callWithRetry(postMessage, [
                destinationId,
                {
                    content:
                        (type == "guild" ? `<@!${author}> ` : "") +
                        `你已经在看鲤了，请等待本轮看鲤结束后再继续开始哦。\n预计还需要观看${parseInt(
                            leftTime / 60
                        )}分${
                            leftTime % 60
                        }秒，看鲤结束后请发送“/结束看鲤”领取积分哦~`,
                    msg_id,
                    msg_type: 7,
                    image:
                        type == "guild"
                            ? "https://cdn.liyuu.ceek.fun/images/wenhao.jpg"
                            : undefined, //？
                    media:
                        type == "group"
                            ? await getPicture(
                                  destinationId,
                                  "https://cdn.liyuu.ceek.fun/images/wenhao.jpg"
                              )
                            : undefined,
                },
                (res) => {
                    console.log(res.data);
                },
                type,
            ]);
            return;
        }
        callWithRetry(postMessage, [
            destinationId,
            {
                content:
                    (type == "guild" ? `<@!${author}> ` : "") +
                    `上一轮的看鲤积分还未领取哦，请先发送“/结束看鲤”领取吧~`,
                msg_id,
                msg_type: 7,
                image:
                    type == "guild"
                        ? "https://cdn.liyuu.ceek.fun/images/zhiren.jpg"
                        : undefined, //指人
                media:
                    type == "group"
                        ? await getPicture(
                              destinationId,
                              "https://cdn.liyuu.ceek.fun/images/zhiren.jpg"
                          )
                        : undefined,
            },
            (res) => {
                console.log(res.data);
            },
            type,
        ]);
        return;
    }
    // 获取此前看鲤记录数量
    const count = await dailyOperationsModel.countDocuments({
        id: author,
        type: "meetLiyuu",
        date: { $gte: new Date().setHours(0, 0, 0, 0) },
        guild_id: type == "guild" ? guild_id : null,
        group_id: type == "group" ? destinationId : null,
    });

    // 获取文案
    const getContent = (count, limit) => {
        // 如果加上这次看鲤已经达到上限
        if (count == limit - 1) {
            return `${meetLiyuuTimeout}分钟后记得发送“/结束看鲤”\n今日已看满${limit}次鲤，${
                type == "guild"
                    ? "接下来的看鲤都不会加积分哦～"
                    : "请明天再来吧～"
            }`;
            // 如果已经超过上限
        } else if (count >= limit) {
            return `本次看鲤将不会增加积分哦~`;
            // 还有至少一次的看鲤机会
        } else {
            return `${meetLiyuuTimeout}分钟后记得发送“/结束看鲤”\n今天还有${
                limit - (count + 1)
            }次看鲤机会`;
        }
    };

    // 群聊拦截
    if (count >= limit && type == "group") {
        callWithRetry(postMessage, [
            destinationId,
            {
                content: `\n今天已经看满${limit}次鲤了，请明天再来哦～${
                    destinationId == "DA863706233CF44DCB4B8EE105101591"
                        ? `\n频道看鲤无上限，常回频道看看~（子频道 🤖 | 每日打卡 看鲤）`
                        : ""
                }`,
                msg_id,
                msg_type: 7,
                media: await getPicture(
                    destinationId,
                    "https://i0.hdslb.com/bfs/new_dyn/d9334afd367cf2c2b03b80f49485621b35611279.jpg@150w_150h.jpg"
                ),
            },
            (res) => {
                console.log(res.data);
            },
            type,
        ]);
        return;
    }

    async function meetLiyuuWithRetry(
        destinationId,
        content,
        msg_id,
        thenFunc,
        retries = 0,
        errors = []
    ) {
        const retryTime = 5;
        try {
            const media = await getPicture(
                type == "group" ? destinationId : null
            );
            // 尝试发送消息并获取发送结果
            const result = await postMessage(
                destinationId,
                {
                    content,
                    msg_id,
                    image: type == "guild" ? media : undefined,
                    media: type == "group" ? media : undefined,
                    msg_type: 7,
                },
                thenFunc,
                type
            );
            return { result, errors };
        } catch (err) {
            // 如果出现错误，记录错误信息并添加到错误数组中
            if (typeof err == "object") errors.push(JSON.stringify(err));
            else errors.push(String(err));

            // 判断是否需要重试
            if (retries < retryTime - 1) {
                // 如果需要重试，等待一段时间后再次调用函数
                await sleep(500);
                // 抛出错误
                console.log(JSON.stringify({ retries, errors }));
                return await meetLiyuuWithRetry(
                    destinationId,
                    content,
                    msg_id,
                    thenFunc,
                    ++retries,
                    errors
                );
            } else {
                // 如果不需要重试，记录错误信息并抛出异常
                console.log(JSON.stringify({ errors }));
            }
        }
    }

    // 如果需要开启看鲤任务
    if (count < limit) {
        await new meetLiyuuModel({
            id: author,
            time: timestamp,
            guild_id: type == "guild" ? guild_id : null,
            group_id: type == "group" ? destinationId : null,
        })
            .save()
            .then((dbRes) => {
                console.log("创建看鲤任务成功", dbRes);
            })
            .catch((err) => {
                console.log("创建看鲤任务失败", err);
            });
        await new dailyOperationsModel({
            id: author,
            type: "meetLiyuu",
            guild_id: type == "guild" ? guild_id : null,
            group_id: type == "group" ? destinationId : null,
        })
            .save()
            .catch((err) => {
                console.log("记录看鲤操作失败", err);
            });
    }

    meetLiyuuWithRetry(
        destinationId,
        (type == "guild" ? `<@!${author}> ` : "") +
            `又来看鲤啦~\n${getContent(count, limit)}\n多多看鲤，陶冶情操！`,
        msg_id
    );
}

export default meetLiyuu;
