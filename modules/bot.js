import { createOpenAPI, createWebsocket } from "qq-bot-sdk";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config = {
    appID: process.env.BOT_APPID,
    token: process.env.BOT_TOKEN,
    intents: ["PUBLIC_GUILD_MESSAGES", "GROUP"],
    sandbox: true,
};

// 创建client
const client = createOpenAPI(config);

// 创建 websocket 连接
const ws = createWebsocket(config);

export { client, ws };
