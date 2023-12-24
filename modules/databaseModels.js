import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB)

// 看鲤积分
const pointsSchema = new mongoose.Schema({
    id: String,
    points: {
        type: Number,
        default: 0,
    },
    guild_id: String,
});
const pointsModel = mongoose.model("points", pointsSchema);

// 看鲤任务记录
const meetLiyuuSchema = new mongoose.Schema({
    id: String,
    time: String,
    guild_id: String,
});
const meetLiyuuModel = mongoose.model("meetLiyuus", meetLiyuuSchema);

// 每天的看鲤操作记录
const dailyOperationsSchema = new mongoose.Schema({
    id: String,
    date: {
        type: Date,
        default: Date.now,
        expires: "1d",
    },
    guild_id: String,
});
const dailyOperationsModel = mongoose.model(
    "dailyOperations",
    dailyOperationsSchema
);

// 频道看鲤次数限制
const meetliyuulimitsSchema = new mongoose.Schema({
    guild_id: String,
    limit: {
        type: Number,
        default: 5,
    },
});
const meetliyuulimitsModel = mongoose.model(
    "meetliyuulimits",
    meetliyuulimitsSchema
);

// 看鲤时长
const meetliyuutimesettingsSchema = new mongoose.Schema({
    guild_id: String,
    time: {
        type: Number,
        default: 5,
    },
});
const meetliyuutimesettingsModel = mongoose.model(
    "meetliyuutimesettings",
    meetliyuutimesettingsSchema
);

// 给予积分数量
const pointsConfigsSchema = new mongoose.Schema({
    guild_id: String,
    pointsMin: {
        type: Number,
        default: 30,
    },
    pointsMax: {
        type: Number,
        default: 60,
    },
});
const pointsConfigsModel = mongoose.model("pointsconfigs", pointsConfigsSchema);

// 看鲤积分
const imagesSchema = new mongoose.Schema({
    url: String,
});
const imagesModel = mongoose.model("images", imagesSchema);

// 看鲤子频道列表
const channelsSchema = new mongoose.Schema({
    channel_id: String,
    guild_id: String,
    operation: String,
});
const channelsModel = mongoose.model("channels", channelsSchema);

// 转推配置
const rtConfigsSchema = new mongoose.Schema({
    id: String,
    channels: Array,
});
const rtConfigsModel = mongoose.model("rtConfigs", rtConfigsSchema);

// 翻译缓存
const translatedContentsSchema = new mongoose.Schema({
    content: String,
    translated: String,
    date: {
        type: Date,
        default: Date.now,
        expires: "1d",
    },
});
const translatedContentsModel = mongoose.model(
    "translatedcontents",
    translatedContentsSchema
);

// 转推内容储存
const retweetsSchema = new mongoose.Schema({
    id: String,
    data: String,
});
const retweetsModel = mongoose.model("retweets", retweetsSchema);

export {
    pointsModel,
    meetLiyuuModel,
    dailyOperationsModel,
    meetliyuulimitsModel,
    meetliyuutimesettingsModel,
    pointsConfigsModel,
    imagesModel,
    channelsModel,
    rtConfigsModel,
    translatedContentsModel,
    retweetsModel
};
