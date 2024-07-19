import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import { pointsModel, dailyOperationsModel } from "../databaseModels.js";
import { isInTheAllowedTime } from "../isInTheAllowedTime.js";

async function rockPaperScissors(
    msg_id,
    destinationId,
    author,
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
    if (type == "group") {
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

    callWithRetry(postMessage, [
        destinationId,
        {
            content: `<@${author}> \n请输入你选择的手势\n例：\n/猜拳 石头\n/猜拳 剪刀\n/猜拳 布`,
            msg_id,
            msg_type: type == "group" ? 2 : 0,
            markdown:
                type == "group"
                    ? {
                          custom_template_id: "102054729_1721348081",
                          // 模板为
                          // <qqbot-at-user id="{{.userid}}" />
                          // **请点击你要选择的手势**
                          params: [{ key: "userid", values: [author] }],
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
                                              id: "rock",
                                              render_data: {
                                                  label: "✊🏻石头",
                                                  visited_label: "✊🏻石头",
                                                  style: 1,
                                              },
                                              action: {
                                                  type: 2,
                                                  permission: {
                                                      type: 0,
                                                      specify_user_ids: [
                                                          author,
                                                      ],
                                                  },
                                                  unsupport_tips:
                                                      "QQ版本过低，请更新",
                                                  data: "/猜拳 石头",
                                                  enter: true,
                                              },
                                          },
                                          {
                                              id: "scissors",
                                              render_data: {
                                                  label: "✌🏻️剪刀",
                                                  visited_label: "✌🏻️剪刀",
                                                  style: 1,
                                              },
                                              action: {
                                                  type: 2,
                                                  permission: {
                                                      type: 0,
                                                      specify_user_ids: [
                                                          author,
                                                      ],
                                                  },
                                                  unsupport_tips:
                                                      "QQ版本过低，请更新",
                                                  data: "/猜拳 剪刀",
                                                  enter: true,
                                              },
                                          },
                                          {
                                              id: "paper",
                                              render_data: {
                                                  label: "✋🏻布",
                                                  visited_label: "✋🏻布",
                                                  style: 1,
                                              },
                                              action: {
                                                  type: 2,
                                                  permission: {
                                                      type: 0,
                                                      specify_user_ids: [
                                                          author,
                                                      ],
                                                  },
                                                  unsupport_tips:
                                                      "QQ版本过低，请更新",
                                                  data: "/猜拳 布",
                                                  enter: true,
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
}

export default rockPaperScissors;
