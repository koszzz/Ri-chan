import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB);

// 看鲤图片
const imagesSchema = new mongoose.Schema({
    url: String,
});
const imagesModel = mongoose.model("images", imagesSchema);

import axios from "axios";

const documents = await imagesModel.find({
    url: { $regex: /^https:\/\/liyuu\.ceek\.fun\/picture/ },
});
const urls = documents.map((i) => decodeURIComponent(i.url.split("?url=")[1]));
const getGifUrl = async (imageUrl, index) => {
    try {
        const response = await axios.get(imageUrl, {
            headers: {
                Referer: "https://m.weibo.cn/",
            },
        });
        const contentType = response.headers["content-type"];
        if (contentType.includes("image/gif")) {
            console.log(documents[index]);
        }
    } catch (error) {
        console.error(error);
    }
};
for (let i = 0; i < urls.length; i++) {
    await getGifUrl(urls[i], i);
}
console.log("end");
