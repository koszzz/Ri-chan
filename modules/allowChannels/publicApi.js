import { channelsModel } from "../databaseModels.js";

async function getAllowedChannelId(guild_id, operation) {
    let res;
    if (guild_id == -1) {
        res = await channelsModel
            .find({
                operation,
            })
            .then((res) => res);
    } else {
        res = await channelsModel
            .find({
                guild_id,
                operation,
            })
            .then((res) => res);
    }
    return res;
}

async function pushAllowedChannelId(channel_id, guild_id, operation) {
    await new channelsModel({
        channel_id,
        guild_id,
        operation,
    }).save();
}

async function canncelAllowedChannelId(channel_id, operation) {
    await channelsModel.deleteOne({ channel_id, operation }).then((res) => {
        console.log(res.data);
    });
}



export { getAllowedChannelId, pushAllowedChannelId, canncelAllowedChannelId };
