import { ws } from "../bot.js";
import getAction from "../getAction.js";

import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import sing from "./sing.js";

function matchSong(text) {
    // 适配多歌名。每个Array第一个为正式歌名，后面的也可以模糊匹配到
    const songs = [
        ["Magic Words"],
        ["ルルカワイマ", "我的可爱法则"],
        ["Endless Vacation"],
        ["めたもるふぉーぜ", "Metamorphose", "脱胎换骨"],
        ["花鳥風月", "花鸟风月"],
        ["BLUE ROSE"],
        ["Ambition"],
        [
            "カラフルホライズン",
            "Colorful Horizon",
            "彩色的地平线",
            "彩色地平线",
        ],
        ["カルペ・ディエム", "活在当下"],
        ["Reply"],
        ["魔法とガムと勇気", "魔法与口香糖与勇气"],
        ["Cherish"],
        ["TRUE FOOL LOVE"],
        ["Touch"],
        ["bloomin’"],
        ["ミオソティス", "勿忘草"],
        ["OPEN UP!"],
        ["Yellow"],
        ["My Beating"],
        ["Miracle Chocolate Night"],
        ["ミルクキャンディ", "Milk Candy", "牛奶糖"],
        [
            "Mirror Rouge (胭脂镜) feat. Liyuu",
            "ミラールージュ",
            "胭脂镜",
            "镜面胭脂",
            "Mirror rouge",
        ],
        ["ミラールージュ feat. Liyuu"],
        ["柠檬气泡 feat. Liyuu", "柠檬气泡"],
        ["Lemonade feat. Liyuu", "Lemonade"],
        ["少年のままで", "此间少年"],
        ["Soaring Heart"],
        ["CuteBit"],
        ["Warp to You"],
        ["カナエルカナタ", "实现的彼方"],
        ["ワンダーランド", "Wonderland", "仙境"],
        ["Loving Loving"],
        ["六等星"],
        ["purple and cycle"],
        ["Polaris"],
        ["Singing In The Rain", "滴落的心声"],
        ["Across The World"],
        [
            "光るなら Piano ver. by DMYoung feat. 黎狱",
            "光るなら",
            "若能绽放光芒",
            "四谎",
        ],
        [
            "金曜日のおはよう Cover by 黎狱",
            "金曜日のおはよう",
            "星期五的早上好",
            "星期五的早安",
            "周五的早上好",
            "周五的早安",
        ],
        [
            "恋のシグナルRin rin rin! Cover by 黎狱",
            "恋のシグナルRin rin rin!",
            "恋爱的信号Rin rin rin!",
            "爱的信号Rin rin rin!",
        ],
        [
            "梦なき梦は梦じゃない Cover by 黎狱",
            "梦なき梦は梦じゃない",
            "没有梦想的梦想不是梦想",
            "没有梦想的梦不是梦",
            "梦梦梦",
        ],
        ["前前前世 Cover by 黎狱", "前前前世"],
        [
            "世界は恋に落ちている Cover by Liyuu",
            "世界は恋に落ちている",
            "我的世界已坠入爱河",
        ],
        ["星間飛行 Cover by Liyuu", "星間飛行", "星间飞行"],
        [
            "Mermaid festa vol.2 ～Passionate～ Piano ver. by DMYoung feat. 黎狱",
            "Mermaid festa vol.2 ～Passionate～",
            "人鱼狂欢节 vol.2 ~激情版~",
            "人鱼狂欢节 vol.2",
            "人鱼2~热情~",
            "人鱼2",
        ],
        [
            "かくしん的☆めたまるふぉ～ぜっ！ Cover by 黎狱",
            "かくしん的☆めたまるふぉ～ぜっ！",
            "革新性的小埋变身",
            "小埋",
        ],
        ["なわとび Cover by 黎狱", "なわとび", "跳绳"],
        [
            "にこぷり♡女子道 Cover by 黎狱",
            "にこぷり♡女子道",
            "Nikopuri♡女子道",
            "可爱妮可的♡女子之道",
            "女子道",
        ],
        [
            "ぶる～べりぃ♡とれいん Cover by 黎狱",
            "ぶる～べりぃ♡とれいん",
            "蓝～莓♡火车",
            "Blue～berry♡Train",
            "蓝莓小火车",
        ],
        ["巴啦啦小魔仙 Cover by 黎狱", "巴啦啦小魔仙"],
        ["バララしょうません Cover by 黎狱", "バララしょうません"],
        ["Bravely You Cover by 黎狱", "Bravely You"],
        ["青空のラプソディ Cover by 黎狱", "青空のラプソディ", "青空狂想曲"],
        ["我多喜欢你，你会知道 Cover by 黎狱", "我多喜欢你，你会知道"],
        ["Catch You Catch Me Cover by Liyuu", "Catch You Catch Me"],
        ["倔强游戏"],
        [
            "白金ディスコ Cover by Liyuu",
            "白金ディスコ",
            "白金DISCO",
            "白金迪斯科",
        ],
        [
            "Oh！レディ・ステディ・ポジティブ - 唐可可（CV. Liyuu）",
            "Oh！レディ・ステディ・ポジティブ",
            "Oh！Ready Steady Positive",
            "心跳在跃动",
        ],
        [
            "水色のSunday - 唐可可（CV. Liyuu）",
            "水色のSunday",
            "水色的Sunday",
            "水色的星期天",
            "水蓝色的Sunday",
            "水蓝色的星期天",
        ],
        [
            "星屑クルージング - 唐可可（CV. Liyuu）",
            "星屑クルージング",
            "群星Cruising",
            "群星巡航",
            "星际遨游",
            "星间遨游",
        ],
        ["See The World（BW2019主题曲）", "See The World"],
        ["No Complete"],
        ["chAngE Cover by Liyuu", "chAngE"],
        [
            "ふわふわ時間 Cover by Liyuu",
            "ふわふわ時間",
            "轻飘飘时间",
            "轻飘飘的时间",
            "滑滑蛋",
        ],
    ].sort((a, b) => b[0].length - a[0].length);
    for (let i = 0; i < songs.length; i++) {
        // 将歌名转换为小写并去除空格和符号
        const normalizedSongs = songs[i].map((song) =>
            song
                .toLowerCase()
                .replace(
                    /[\s\-\.,\?!:@#$%^&～~*()（）_’，！☆♡\'\"\/\\\[\]]/g,
                    ""
                )
        );

        // 匹配歌名
        if (
            normalizedSongs.findIndex((song) =>
                text
                    .toLowerCase()
                    .replace(
                        /[\s\-\.,\?!:@#$%^&～~*()（）_’，！☆♡\'\"\/\\\[\]]/g,
                        ""
                    )
                    .includes(song)
            ) !== -1
        ) {
            // 双语歌处理
            if (
                text
                    .toLowerCase()
                    .replace(
                        /[\s\-\.,\?!:@#$%^&～~*()（）_’，！☆♡\'\"\/\\\[\]]/g,
                        ""
                    )
                    .includes("日语")
            ) {
                if (songs[i][0] == "Mirror Rouge (胭脂镜) feat. Liyuu") {
                    return "ミラールージュ feat. Liyuu";
                } else if (songs[i][0] == "巴啦啦小魔仙 Cover by 黎狱") {
                    return "バララしょうません Cover by 黎狱";
                }
            }
            return songs[i][0];
        }
    }
    return undefined;
}

export default () => {
    ws.on("GROUP_AND_C2C_EVENT", (data) => {
        if (data.eventType == "GROUP_AT_MESSAGE_CREATE") {
            const author = data.msg.author.member_openid;
            const msg_id = data.msg.id;
            const group_id = data.msg.group_openid;
            const content = data.msg.content;
            const timestamp = data.msg.timestamp;
            const action = getAction(content, "group");
            if (action == "点歌") {
                const song = matchSong(content);
                console.log(song);
                if (!song) {
                    callWithRetry(postMessage, [
                        group_id,
                        {
                            msg_id,
                            msg_type: 2,
                            // markdown: {
                            //     custom_template_id: "102054729_1721386271",
                            //     // 模板为
                            //     // <qqbot-at-user id="{{.userid}}" />
                            //     // 小鲤没有识别到歌曲哦
                            //     // 请确认歌手为 **Liyuu**
                            //     params: [
                            //         { key: "userid", values: [author] },
                            //     ],
                            // },
                            keyboard: {
                                content: {
                                    rows: [
                                        {
                                            buttons: [
                                                {
                                                    id: "sing",
                                                    render_data: {
                                                        label: "点歌示例",
                                                        visited_label:
                                                            "点歌示例",
                                                        style: 1,
                                                    },
                                                    action: {
                                                        type: 2,
                                                        permission: {
                                                            type: 2,
                                                        },
                                                        unsupport_tips:
                                                            "QQ版本过低，请更新",
                                                        data: "/点歌 我的可爱法则",
                                                    },
                                                },
                                                {
                                                    id: "list",
                                                    render_data: {
                                                        label: "可用歌单",
                                                        visited_label:
                                                            "可用歌单",
                                                        style: 1,
                                                    },
                                                    action: {
                                                        type: 0,
                                                        permission: {
                                                            type: 2,
                                                        },
                                                        unsupport_tips:
                                                            "QQ版本过低，请更新",
                                                        data: "https://m.q.qq.com/a/p/1108338344?s=%2Fpages%2Fwebview%2Fwebview%3Furl%3Dhttps%253A%252F%252Fdocs.qq.com%252Fsheet%252FDS0FXV3JJV2VleG9O%253Ftab%253D000001%26shareable%3Dtrue",
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
                sing(msg_id, group_id, author, song, "group");
            }
        }
    });
};
