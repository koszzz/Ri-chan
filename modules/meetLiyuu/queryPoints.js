import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
// 引入mongodbModels
import { pointsModel } from "../databaseModels.js";

// 获取允许看鲤的子频道
import { getAllowedChannelId } from "../allowChannels/publicApi.js";

// 引入botClient
import { client } from "../bot.js";

async function queryPoints(
    msg_id,
    destinationId,
    author,
    authorName,
    guild_id,
    type = "guild"
) {
    if (type == "guild") {
        // 获取允许看鲤的子频道
        const meetLiyuuChannelId = await getAllowedChannelId(
            guild_id,
            "meetLiyuu"
        );
        // 如果不允许看鲤
        if (
            meetLiyuuChannelId.findIndex(
                (i) => i.channel_id == destinationId
            ) == -1
        ) {
            callWithRetry(postMessage, [
                destinationId,
                {
                    content: `<@!${author}> 宝子~不能在<#${destinationId}>查看积分哦~\n现在${
                        meetLiyuuChannelId
                            .map((i) => `<#${i.channel_id}>`)
                            .join("") == ""
                            ? "没有子频道"
                            : "有" +
                              meetLiyuuChannelId
                                  .map((i) => `<#${i.channel_id}>`)
                                  .join("")
                    }可以查询积分~`,
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
    // 获取看鲤积分前10名
    const pointsRanking = await pointsModel.find(
        {
            guild_id: type == "guild" ? guild_id : null,
            group: type == "group" ? destinationId : null,
        },
        null,
        {
            sort: { points: -1 },
            limit: 10,
        }
    );
    const rankingData = await Promise.all(
        pointsRanking.map(async (i) => {
            let returnMain;
            try {
                // 获取昵称
                if (type == "guild") {
                    const userData = await client.guildApi.guildMember(
                        guild_id,
                        i.id
                    );
                    returnMain = {
                        username: userData.data.user.username,
                        points: i.points,
                    };
                } else if (type == "group") {
                    returnMain = {
                        username: "[无法获取]",
                        points: i.points,
                    };
                }
            } catch (err) {
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
        rankingText += index + 1 + " | " + i.username + " | " + i.points + "\n";
    });
    // 获取查询者排名、积分
    let points = 0,
        rank = 0,
        userData = {
            data: {
                user: {
                    username: authorName,
                },
            },
        };
    try {
        // 获取查询者积分
        const result = await pointsModel.findOne(
            {
                id: author,
                guild_id: type == "guild" ? guild_id : null,
                group_id: type == "group" ? destinationId : null,
            },
            "points"
        );
        // 获取查询者排名
        if (result) {
            const userPoints = result.points;
            points = userPoints;
            const rankResult = await pointsModel.aggregate([
                {
                    $match: {
                        points: { $gt: userPoints },
                        guild_id: type == "guild" ? guild_id : null,
                        group_id: type == "group" ? destinationId : null,
                    },
                },
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
        destinationId,
        {
            content:
                (type == "guild" ? `<@!${author}> ` : "") +
                `\n排名 | 昵称 | 积分\n-------------\n${rank} | ${userData.data.user.username} | ${points}\n-------------\n${rankingText}`,
            msg_id,
            msg_type: 0,
        },
        (res) => {
            console.log(res.data);
        },
        type,
    ]);
}

export default queryPoints;
