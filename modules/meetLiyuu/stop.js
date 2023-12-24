import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import dayjs from "dayjs";
// 引入mongodbModels
import {
    pointsModel,
    meetLiyuuModel,
    dailyOperationsModel,
    meetliyuulimitsModel,
    meetliyuutimesettingsModel,
    pointsConfigsModel
} from "../databaseModels.js";

// 获取允许看鲤的子频道
import { getAllowedChannelId } from "../allowChannels/publicApi.js";

async function stopWatching(msg_id, channel_id, author, guild_id) {
    // 获取允许看鲤的子频道
    const meetLiyuuChannelId = await getAllowedChannelId(guild_id, "meetLiyuu");
    // 如果当前子频道允许看鲤
    if (meetLiyuuChannelId.filter((i) => i.channel_id == channel_id).length) {
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
        // 获取当前看过鲤次数
        const count = await dailyOperationsModel.countDocuments({
            id: author,
            date: { $gte: new Date().setHours(0, 0, 0, 0) },
            guild_id,
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
        // 如果没有进行中的看鲤任务
        if (meetLiyuuDbData.length == 0) {
            // 且还可以有看鲤任务发起
            if (count < limit) {
                callWithRetry(postMessage, [
                    channel_id,
                    {
                        content: `<@!${author}> 宝子~你还没有开始看鲤哦~\n请先发送“/看鲤”开始看鲤吧~`,
                        msg_id,
                        image: "https://cdn.liyuu.ceek.fun/images/heart.jpg", //比心
                    },
                    (res) => {
                        console.log(res.data);
                    },
                ]);
            } else {
                // 不会有看鲤任务发起
                callWithRetry(postMessage, [
                    channel_id,
                    {
                        content: `<@!${author}> 宝子~今天已经看满${limit}次鲤了~不再会开启计时任务了~\n请尽情“/看鲤”吧！\n多多看鲤，陶冶情操！`,
                        msg_id,
                        image: "https://cdn.liyuu.ceek.fun/images/hao.jpg", //好
                    },
                    (res) => {
                        console.log(res.data);
                    },
                ]);
            }
        } else {
            // 还未完成观看
            // 获取剩余所需时间
            const leftTime = dayjs(meetLiyuuDbData[0].time)
                .add(meetLiyuuTimeout, "minute")
                .diff(dayjs(), "second");
            if (leftTime > 0) {
                callWithRetry(postMessage, [
                    channel_id,
                    {
                        content: `<@!${author}> 看鲤贵在坚持，不可偷懒哦~\n预计还需要观看${parseInt(
                            leftTime / 60
                        )}分${leftTime % 60}秒 ，请到点后再结束看鲤哦！`,
                        msg_id,
                        image: "https://cdn.liyuu.ceek.fun/images/whiteWaching.jpg", //白色卫衣Liyuu is watching you
                    },
                    (res) => {
                        console.log(res.data);
                    },
                ]);
            } else {
                // 已完成观看
                async function generateRandomNumber() {
                    // 生成一个0到1之间的随机数
                    let random = Math.random();

                    // 判断随机数是否小于等于0.001
                    if (random <= 0.001) {
                        // 如果小于等于0.001，返回109
                        return 109;
                    } else {
                        const pointsConfig = await pointsConfigsModel
                            .find({
                                guild_id,
                            })
                            .then((res) => {
                                if (res[0]) {
                                    return [res[0].pointsMin, res[0].pointsMax];
                                } else {
                                    return [30, 60];
                                }
                            });
                        // 如果大于0.001，生成普遍随机数
                        let randomNumber =
                            Math.floor(
                                Math.random() *
                                    (pointsConfig[1] - pointsConfig[0] + 1)
                            ) + pointsConfig[0];
                        return randomNumber;
                    }
                }
                const addPoints = await generateRandomNumber();
                let nowpoints = 0;
                // 获取现有分数
                await pointsModel
                    .find({ id: author, guild_id })
                    .then((dbRes) => {
                        // 有现有分数
                        if (dbRes.length > 0) {
                            nowpoints = dbRes[0].points;
                        }
                    });
                callWithRetry(postMessage, [
                    channel_id,
                    {
                        content: `<@!${author}> 宝子~恭喜你完成观看！${
                            addPoints == 109
                                ? "你可太幸运啦！抽到了只有0.1%几率的鱼鱼生日——0109！"
                                : ""
                        }给你${addPoints}积分的奖励~你现在有${
                            nowpoints + addPoints
                        }积分~`,
                        msg_id,
                        image: "https://cdn.liyuu.ceek.fun/images/heart.jpg", //比心
                    },
                    async (res) => {
                        await meetLiyuuModel
                            .deleteOne({ id: author, guild_id })
                            .then(() => {
                                console.log(res.data);
                            });
                        // 判断数据库内是否有数据
                        await pointsModel
                            .find({ id: author, guild_id })
                            .then(async (dbRes) => {
                                // 有数据
                                if (dbRes.length > 0) {
                                    // 修改分数
                                    await pointsModel.updateOne(
                                        { id: author, guild_id },
                                        { points: dbRes[0].points + addPoints }
                                    );
                                } else {
                                    await new pointsModel({
                                        id: author,
                                        points: addPoints,
                                        guild_id,
                                    }).save();
                                }
                            });
                    },
                ]);
            }
        }
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~不能在<#${channel_id}>结束看鲤哦~\n现在${
                    meetLiyuuChannelId
                        .map((i) => `<#${i.channel_id}>`)
                        .join("") == ""
                        ? "没有子频道"
                        : "有" +
                          meetLiyuuChannelId
                              .filter((i) => i.channel_id != channel_id)
                              .map((i) => `<#${i.channel_id}>`)
                              .join("")
                }可以结束看鲤~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/dame.jpg", // 摇摇手指大咩哟
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

export default stopWatching;
