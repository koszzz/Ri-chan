import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
// 引入mongodbModels
import { pointsModel } from "../databaseModels.js";

// 获取允许看鲤的子频道
import { getAllowedChannelId } from "../allowChannels/publicApi.js";

// 引入botClient
import { client } from "../bot.js";

async function queryPoints(msg_id, channel_id, author, guild_id) {
    // 获取允许看鲤的子频道
    const meetLiyuuChannelId = await getAllowedChannelId(guild_id, "meetLiyuu");
    // 如果允许看鲤
    if (meetLiyuuChannelId.filter((i) => i.channel_id == channel_id).length) {
        // 获取看鲤积分前10名
        const pointsRanking = await pointsModel.find({ guild_id }, null, {
            sort: { points: -1 },
            limit: 10,
        });
        const rankingData = await Promise.all(
            pointsRanking.map(async (i) => {
                let userData, returnMain;
                try {
                    // 获取昵称
                    userData = await client.guildApi.guildMember(
                        guild_id,
                        i.id
                    );
                    returnMain = {
                        username: userData.data.user.username,
                        points: i.points,
                    };
                } catch (err) {
                    console.log(
                        "获取频道用户信息错误：",
                        err,
                        JSON.stringify({ guild_id, id: i.id })
                    );
                    returnMain = {
                        username: "[获取失败]",
                        points: i.points,
                    };
                }
                return returnMain;
            })
        );
        // 文案
        let rankingText = "";
        rankingData.forEach((i, index) => {
            rankingText +=
                index + 1 + " | " + i.username + " | " + i.points + "\n";
        });
        // 获取查询者排名、积分
        let points = 0,
            rank = 0,
            userData;
        try {
            // 获取查询者昵称
            userData = await client.guildApi.guildMember(guild_id, author);
        } catch (err) {
            console.log(
                "获取频道用户信息错误：",
                err,
                JSON.stringify({ guild_id, author })
            );
            userData = {
                data: {
                    user: {
                        username: "[获取失败]",
                    },
                },
            };
        }
        try {
            // 获取查询者积分
            const result = await pointsModel.findOne(
                { id: author, guild_id },
                "points"
            );
            // 获取查询者排名
            if (result) {
                const userPoints = result.points;
                points = userPoints;
                const rankResult = await pointsModel.aggregate([
                    { $match: { points: { $gt: userPoints }, guild_id } },
                    { $group: { _id: null, count: { $sum: 1 } } },
                ]);

                rank = rankResult[0]?.count + 1 || 1;
            } else {
                console.log("找不到用户");
            }
        } catch (err) {
            console.log(err);
        }
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> \n排名 | 昵称 | 积分\n-------------\n${rank} | ${userData.data.user.username} | ${points}\n-------------\n${rankingText}`,
                msg_id,
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    } else {
        callWithRetry(postMessage, [
            channel_id,
            {
                content: `<@!${author}> 宝子~不能在<#${channel_id}>查看积分哦~\n现在${
                    meetLiyuuChannelId
                        .map((i) => `<#${i.channel_id}>`)
                        .join("") == ""
                        ? "没有子频道"
                        : "有" +
                          meetLiyuuChannelId
                              .filter((i) => i.channel_id != channel_id)
                              .map((i) => `<#${i.channel_id}>`)
                              .join("")
                }可以查询积分~`,
                msg_id,
                image: "https://cdn.liyuu.ceek.fun/images/dame.jpg", // 摇摇手指大咩哟
            },
            (res) => {
                console.log(res.data);
            },
        ]);
    }
}

export default queryPoints