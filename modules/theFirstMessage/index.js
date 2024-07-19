import { ws } from "../bot.js";

import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";

export default () => {
    ws.on("GROUP_AND_C2C_EVENT", (data) => {
        if (data.eventType == "GROUP_ADD_ROBOT") {
            const { eventId: event_id, msg } = data;
            const { group_openid } = msg;
            callWithRetry(postMessage, [
                group_openid,
                {
                    content: ``,
                    event_id,
                    msg_type: 2,
                    markdown: {
                        custom_template_id: "102054729_1720600971",
                        // 模板为
                        //![Liyuu #{{.width}}px #{{.height}}px]({{.url}})
                        // 
                        //鲤好～我是小鲤！
                        //我可以为你推送Liyuu图片、和你猜拳、为你唱歌！
                        //来试试「/看鲤」「/猜拳」「/点歌」吧～
                        
                        params: [
                            { key: "width", values: ['200'] },
                            { key: "height", values: ["300"] },
                            { key: "url", values: ["https://i0.hdslb.com/bfs/new_dyn/e97d5cf30b79cf041041cdd06f5683334549624.png"] },
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
                                                label: "看鲤",
                                                visited_label: "看鲤",
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
                                                enter: false,
                                            },
                                        },
                                        {
                                            id: "rps",
                                            render_data: {
                                                label: "猜拳",
                                                visited_label: "猜拳",
                                                style: 1,
                                            },
                                            action: {
                                                type: 2,
                                                permission: {
                                                    type: 2,
                                                },
                                                unsupport_tips:
                                                    "QQ版本过低，请更新",
                                                data: "/猜拳",
                                                enter: false,
                                            },
                                        },
                                        {
                                            id: "sing",
                                            render_data: {
                                                label: "点歌",
                                                visited_label: "点歌",
                                                style: 1,
                                            },
                                            action: {
                                                type: 2,
                                                permission: {
                                                    type: 2,
                                                },
                                                unsupport_tips:
                                                    "QQ版本过低，请更新",
                                                data: "/点歌",
                                                enter: false,
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
                "group",
            ]);
            return;
        }
    });
};
