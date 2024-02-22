import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB);

// 看鲤积分
const pointsSchema = new mongoose.Schema({
    id: String,
    points: {
        type: Number,
        default: 0,
    },
    guild_id: String,
    group_id: String,
});
const pointsModel = mongoose.model("points", pointsSchema);

// 看鲤任务记录
const meetLiyuuSchema = new mongoose.Schema({
    id: String,
    time: String,
    guild_id: String,
    group_id: String,
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
    group_id: String,
});
const dailyOperationsModel = mongoose.model(
    "dailyOperations",
    dailyOperationsSchema
);

// 看鲤图片
const imagesSchema = new mongoose.Schema({
    url: String,
});
const imagesModel = mongoose.model("images", imagesSchema);

// 允许操作子频道列表
const channelsSchema = new mongoose.Schema({
    group_id: String,
    channel_id: String,
    guild_id: String,
    operation: String,
});
const channelsModel = mongoose.model("channels", channelsSchema);

export {
    pointsModel,
    meetLiyuuModel,
    dailyOperationsModel,
    imagesModel,
    channelsModel,
};
