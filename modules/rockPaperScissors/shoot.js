import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import { isInTheAllowedTime } from "../isInTheAllowedTime.js";

// 引入mongodbModels
import {
    pointsModel,
    rockPaperScissorsImagesModel,
    dailyOperationsModel,
} from "../databaseModels.js";
import { getFileInfo } from "../getFileInfo.js";

function getIcon(choice) {
    const icon = {
        石头: "✊🏻",
        剪刀: "✌🏻",
        布: "✋🏻",
    };
    return icon[choice];
}

function getResult(choice) {
    const choices = ["石头", "剪刀", "布"];
    const randomIndex = Math.floor(Math.random() * choices.length);
    const LiyuusChoice = choices[randomIndex];
    const getWinner = (liyuu, guest) => {
        if (liyuu == guest) {
            return "draw";
        }
        if (
            (liyuu == "布" && guest == "石头") ||
            (liyuu == "石头" && guest == "剪刀") ||
            (liyuu == "剪刀" && guest == "布")
        ) {
            return "liyuu";
        }
        return "guest";
    };
    const winner = getWinner(LiyuusChoice, choice);
    return {
        LiyuusChoice,
        winner,
    };
}

function generateRandomPoint(win = false) {
    // 生成一个0到1之间的随机数
    let random = Math.random();

    // 判断随机数是否小于等于0.001
    if (random <= 0.001 && win) {
        // 如果小于等于0.001，返回109
        return 109;
    } else {
        const pointsConfig = win ? [10, 20] : [11, 22];
        // 如果大于0.001，生成普遍随机数
        let randomNumber =
            Math.floor(
                Math.random() * (pointsConfig[1] - pointsConfig[0] + 1)
            ) + pointsConfig[0];
        return randomNumber;
    }
}

async function getChoicePicture(choice, group_id) {
    const chineseToEnglish = {
        石头: "rock",
        剪刀: "scissors",
        布: "paper",
    };
    const url = await rockPaperScissorsImagesModel
        .countDocuments({ type: chineseToEnglish[choice] })
        .then((count) => {
            const randomIndex = Math.floor(Math.random() * count);
            return rockPaperScissorsImagesModel
                .findOne({ type: chineseToEnglish[choice] })
                .skip(randomIndex)
                .exec();
        })
        .then((res) => res.url)
        .catch((err) => {
            console.log(err);
        });
    if (group_id) {
        const file_info = await getFileInfo(group_id, url);
        if (file_info == "") {
            return await getChoicePicture(choice, group_id);
        }
        return file_info;
    }
    return url;
}

async function shoot(
    msg_id,
    destinationId,
    author,
    choice,
    type = "guild",
    guild_id
) {
    // 时间限制
    if (!isInTheAllowedTime(destinationId) && type == "group") {
        callWithRetry(postMessage, [
            destinationId,
            {
                content: `\n当前不在可用猜拳时间\n请在北京时间 00:00～09:00、17:00～18:00 来猜拳哦～`,
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
    // 获取现有分数
    let nowpoints = 0;
    await pointsModel
        .find({
            id: author,
            guild_id: type == "guild" ? guild_id : null,
            group_id: type == "group" ? destinationId : null,
        })
        .then((dbRes) => {
            // 有现有分数
            if (dbRes.length > 0) {
                nowpoints = dbRes[0].points;
            }
        });

    // 判断是否满足资格
    if (nowpoints < 22) {
        callWithRetry(postMessage, [
            destinationId,
            {
                content: `<@${author}> 参加猜拳至少要有22积分哦～\n请「/看鲤」获得吧`,
                msg_id,
                msg_type: type == "group" ? 2 : 0,
                markdown:
                    type == "group"
                        ? {
                              custom_template_id: "102054729_1721348027",
                              // 模板为
                              // <qqbot-at-user id="{{.userid}}" />
                              // {{.activity}}至少要有**{{.point}}积分**哦
                              // 请**「/看鲤」**获得吧～
                              params: [
                                  { key: "userid", values: [author] },
                                  { key: "activity", values: ["参加猜拳"] },
                                  { key: "point", values: ["22"] },
                              ],
                          }
                        : undefined,
                keyboard:
                    type == "group"
                        ? {
                              content: {
                                  rows: [
                                      {
                                          buttons: [
                                              {
                                                  id: "meetLiyuu",
                                                  render_data: {
                                                      label: "/看鲤",
                                                      visited_label: "/看鲤",
                                                      style: 1,
                                                  },
                                                  action: {
                                                      type: 2,
                                                      permission: {
                                                          type: 2,
                                                      },
                                                      unsupport_tips:
                                                          "QQ版本过低，请更新",
                                                      data: "/看鲤",
                                                  },
                                              },
                                          ],
                                      },
                                  ],
                              },
                          }
                        : undefined,
            },
            (res) => {
                console.log(res.data);
            },
            type,
        ]);
        return;
    }
    // 获取猜拳次数限制
    const limit = 3;
    // 获取此前猜拳记录数量
    const count = await dailyOperationsModel.countDocuments({
        id: author,
        type: "rockPaperScissors",
        date: { $gte: new Date().setHours(0, 0, 0, 0) },
        guild_id: type == "guild" ? guild_id : null,
        group_id: type == "group" ? destinationId : null,
    });
    if (type == "group") {
        if (count >= limit) {
            callWithRetry(postMessage, [
                destinationId,
                {
                    content:
                        (type == "guild" ? `<@${author}> ` : "") +
                        `今天已经猜过${limit}次拳了，请明天再来哦～`,
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
    }

    const { LiyuusChoice, winner } = getResult(choice);
    let text =
        (type == "guild" ? `<@${author}>` : "") +
        ` \n-------------\n你出了「${getIcon(
            choice
        )}${choice}」\n小鲤出了「${getIcon(
            LiyuusChoice
        )}${LiyuusChoice}」\n-------------\n`;

    if (winner == "guest") {
        const addPoints = generateRandomPoint(true);
        nowpoints = nowpoints + addPoints;
        text += `恭喜你！你赢啦～${
            addPoints == 109
                ? "你可太幸运啦！抽到了只有0.1%几率的鱼鱼生日——0109！"
                : ""
        }给你${addPoints}积分的奖励～你现在有${nowpoints}积分~`;
    }
    if (winner == "liyuu") {
        const subtractPoints = generateRandomPoint(false);
        nowpoints = nowpoints - subtractPoints;
        text += `你输啦！扣除你${subtractPoints}积分，你现在还有${nowpoints}积分~`;
    }
    if (winner == "draw") {
        text += `哦吼平局！欢迎下次尝试～`;
    }

    // 次数
    if (type == "group") {
        if (count == limit - 1) {
            text += `\n\n今日已猜满${limit}次拳，请明天再来吧～`;
        } else {
            text += `\n\n今日还有${limit - (count + 1)}次猜拳机会`;
        }
    }

    const picture = await getChoicePicture(
        LiyuusChoice,
        type == "group" ? destinationId : null
    );
    callWithRetry(postMessage, [
        destinationId,
        {
            content: text,
            msg_id,
            msg_type: 7,
            image: type == "guild" ? picture : undefined,
            media: type == "group" ? picture : undefined,
        },
        async () => {
            if (type == "group") {
                await new dailyOperationsModel({
                    id: author,
                    type: "rockPaperScissors",
                    guild_id: type == "guild" ? guild_id : null,
                    group_id: type == "group" ? destinationId : null,
                })
                    .save()
                    .catch((err) => {
                        console.log("记录猜拳操作失败", err);
                    });
            }
            // 修改分数
            await pointsModel.updateOne(
                {
                    id: author,
                    guild_id: type == "guild" ? guild_id : null,
                    group_id: type == "group" ? destinationId : null,
                },
                { points: nowpoints }
            );
        },
        type,
    ]);
}

export default shoot;
