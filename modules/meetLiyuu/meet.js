import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import sleep from "../sleep.js";
import dayjs from "dayjs";
// 引入mongodbModels
import {
    meetLiyuuModel,
    dailyOperationsModel,
    meetliyuulimitsModel,
    meetliyuutimesettingsModel,
    imagesModel,
} from "../databaseModels.js";

// 获取允许看鲤的子频道
import { getAllowedChannelId } from "../allowChannels/publicApi.js";

// 看鲤
async function meetLiyuu(msg_id, channel_id, author, timestamp, guild_id) {
    // 获取允许看鲤的子频道
    const meetLiyuuChannelId = await getAllowedChannelId(guild_id, "meetLiyuu");
    // 如果当前子频道允许看鲤
    if (meetLiyuuChannelId.filter((i) => i.channel_id == channel_id).length) {
        // 获取看鲤所需时间
        const meetLiyuuTimeout = await meetliyuutimesettingsModel
            .find({
                guild_id,
            })
            .then((res) => {
                if (res[0]) {
                    return res[0].time;
                } else {
                    return 5;
                }
            });

        // 获取看鲤次数限制
        const limit = await meetliyuulimitsModel
            .find({
                guild_id,
            })
            .then((res) => {
                if (res[0]) {
                    return res[0].limit;
                } else {
                    return 5;
                }
            });
        // 获取看鲤任务
        const meetLiyuuDbData = await meetLiyuuModel
            .find({
                id: author,
                guild_id,
            })
            .then((res) => {
                return res;
            });
        // 如果目前没有看鲤记录
        if (!meetLiyuuDbData.length) {
            try {
                // 获取此前看鲤记录数量
                const count = await dailyOperationsModel.countDocuments({
                    id: author,
                    date: { $gte: new Date().setHours(0, 0, 0, 0) },
                    guild_id,
                });

                // 获取文案
                const getContent = (count, limit) => {
                    // 如果加上这次看鲤已经达到上限
                    if (count == limit - 1) {
                        return `${meetLiyuuTimeout}分钟后记得发送“/结束看鲤”\n今日已看满${limit}次鲤，接下来的看鲤都不会加积分哦~`;
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

                async function meetLiyuuWithRetry(
                    channel_id,
                    content,
                    msg_id,
                    thenFunc,
                    retries = 0,
                    errors = []
                ) {
                    const retryTime = 5;
                    try {
                        // 获取看鲤图片
                        let liyuuPicture;
                        await imagesModel
                            .countDocuments()
                            .then((count) => {
                                const randomIndex = Math.floor(
                                    Math.random() * count
                                );
                                return imagesModel
                                    .findOne()
                                    .skip(randomIndex)
                                    .exec();
                            })
                            .then((result) => {
                                liyuuPicture = result;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        // 尝试发送消息并获取发送结果
                        const result = await postMessage(
                            channel_id,
                            {
                                content,
                                msg_id,
                                image: liyuuPicture.url,
                            },
                            thenFunc
                        );
                        return { result, errors };
                    } catch (err) {
                        // 如果出现错误，记录错误信息并添加到错误数组中
                        if (typeof err == "object")
                            errors.push(JSON.stringify(err));
                        else errors.push(String(err));

                        // 判断是否需要重试
                        if (retries < retryTime - 1) {
                            // 如果需要重试，等待一段时间后再次调用函数
                            await sleep(500);
                            // 抛出错误
                            console.log(JSON.stringify({ retries, errors }));
                            return await meetLiyuuWithRetry(
                                channel_id,
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

                meetLiyuuWithRetry(
                    channel_id,
                    `<@!${author}> 又来看鲤啦~\n${getContent(
                        count,
                        limit
                    )}\n多多看鲤，陶冶情操！`,
                    msg_id,
                    async (res) => {
                        // 如果需要开启看鲤任务
                        if (count < limit) {
                            await new meetLiyuuModel({
                                id: author,
                                time: timestamp,
                                guild_id,
                            })
                                .save()
                                .then((dbRes) => {
                                    console.log(res.data);
                                    console.log("创建看鲤任务成功", dbRes);
                                })
                                .catch((err) => {
                                    console.log("创建看鲤任务失败", err);
                                });
                            await new dailyOperationsModel({
                                id: author,
                                guild_id,
                            })
                                .save()
                                .catch((err) => {
                                    console.log("记录看鲤操作失败", err);
                                });
                        }
                    }
                );
            } catch (err) {
                console.log("看鲤错误:", err);
            }
        } else {
            // 看鲤剩余所需时间
            const leftTime = dayjs(meetLiyuuDbData[0].time)
                .add(meetLiyuuTimeout, "minute")
                .diff(dayjs(), "second");
            // 还未完成观看
            if (leftTime > 0) {
                callWithRetry(postMessage, [
                    channel_id,
                    {
                        content: `<@!${author}> 你已经在看鲤了，请等待本轮看鲤结束后再继续开始哦。\n预计还需要观看${parseInt(
                            leftTime / 60
                        )}分${
                            leftTime % 60
                        }秒，看鲤结束后请发送“/结束看鲤”领取积分哦~`,
                        msg_id,
                        image: "https://cdn.liyuu.ceek.fun/images/wenhao.jpg", //？
                    },
                    (res) => {
                        console.log(res.data);
                    },
                ]);
            } else {
                callWithRetry(postMessage, [
                    channel_id,
                    {
                        content: `<@!${author}> 上一轮的看鲤积分还未领取哦，请先发送“/结束看鲤”领取吧~`,
                        msg_id,
                        image: "https://cdn.liyuu.ceek.fun/images/zhiren.jpg", //指人
                    },
                    (res) => {
                        console.log(res.data);
                    },
                ]);
            }
        }
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~不能在<#${channel_id}>看鲤哦~\n现在${
                    meetLiyuuChannelId
                        .map((i) => `<#${i.channel_id}>`)
                        .join("") == ""
                        ? "没有子频道"
                        : "有" +
                          meetLiyuuChannelId
                              .filter((i) => i.channel_id != channel_id)
                              .map((i) => `<#${i.channel_id}>`)
                              .join("")
                }可以看鲤~`,
                msg_id,
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

export default meetLiyuu;
