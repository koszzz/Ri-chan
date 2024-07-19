import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";

import { pointsModel } from "../databaseModels.js";

import { getFileInfo } from "../getFileInfo.js";

async function getSong(name, group_id) {
    const url = `https://cdn.liyuu.ceek.fun/songs/${name}.silk`;
    if (group_id) {
        const file_info = await getFileInfo(group_id, url, false, 3);
        if (file_info == "") {
            return await getSong(name, group_id);
        }
        return file_info;
    }
    return url;
}

async function sing(msg_id, destinationId, author, song, type = "group") {
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
    if (nowpoints < 50) {
        callWithRetry(postMessage, [
            destinationId,
            {
                msg_id,
                msg_type: 2,
                markdown: {
                    custom_template_id: "102054729_1721348027",
                    // 模板为
                    // <qqbot-at-user id="{{.userid}}" />
                    // {{.activity}}至少要有**{{.point}}积分**哦
                    // 请**「/看鲤」**获得吧～
                    params: [
                        { key: "userid", values: [author] },
                        { key: "activity", values: ["点歌"] },
                        { key: "point", values: ["50"] },
                    ],
                },
                keyboard: {
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
                },
            },
            (res) => {
                console.log(res.data);
            },
            type,
        ]);
        return;
    }
    nowpoints = nowpoints - 50;
    callWithRetry(postMessage, [
        destinationId,
        {
            content: `请稍等...马上为您献唱「${song}」\n\n点歌将扣除您50积分，您目前剩余${nowpoints}积分`,
            msg_id,
            msg_type: 0,
        },
        (res) => {
            console.log(res.data);
        },
        type,
    ]);
    const songFile = await getSong(song, destinationId);
    callWithRetry(postMessage, [
        destinationId,
        {
            content: " ",
            msg_id,
            msg_type: 7,
            media: songFile,
            msg_seq: 2,
        },
        async () => {
            // 修改分数
            await pointsModel.updateOne(
                {
                    id: author,
                    guild_id: type == "guild" ? guild_id : null,
                    group_id: type == "group" ? destinationId : null,
                },
                { points: nowpoints }
            );
            // 双语歌提示
            if (song == "Mirror Rouge (胭脂镜) feat. Liyuu") {
                callWithRetry(postMessage, [
                    destinationId,
                    {
                        content: `注意！这首歌有日语版本\n想要听日语版的话，请在歌名后添加「（日语版）」\n\n示例：\n/点歌 胭脂镜（日语版）`,
                        msg_id,
                        msg_type: 0,
                        msg_seq: 3,
                    },
                    (res) => {
                        console.log(res.data);
                    },
                    type,
                ]);
            } else if (song == "巴啦啦小魔仙 Cover by 黎狱") {
                callWithRetry(postMessage, [
                    destinationId,
                    {
                        content: `注意！这首歌有日语版本\n想要听日语版的话，请在歌名后添加「（日语版）」\n\n示例：\n/点歌 巴啦啦小魔仙（日语版）`,
                        msg_id,
                        msg_type: 0,
                        msg_seq: 3,
                    },
                    (res) => {
                        console.log(res.data);
                    },
                    type,
                ]);
            } else if (song == "柠檬气泡 feat. Liyuu") {
                callWithRetry(postMessage, [
                    destinationId,
                    {
                        content: `注意！这首歌有日语版本\n想要听日语版的话，请使用歌名「Lemonade」\n\n示例：\n/点歌 Lemonade`,
                        msg_id,
                        msg_type: 0,
                        msg_seq: 3,
                    },
                    (res) => {
                        console.log(res.data);
                    },
                    type,
                ]);
            } else if (song == "Lemonade feat. Liyuu") {
                callWithRetry(postMessage, [
                    destinationId,
                    {
                        content: `注意！这首歌有中文版本\n想要听中文版的话，请使用歌名「柠檬气泡」\n\n示例：\n/点歌 柠檬气泡`,
                        msg_id,
                        msg_type: 0,
                        msg_seq: 3,
                    },
                    (res) => {
                        console.log(res.data);
                    },
                    type,
                ]);
            }
        },
        type,
    ]);
}

export default sing;
