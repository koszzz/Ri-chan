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

async function pushAllowedChannelId(group_id, channel_id, guild_id, operation) {
    await new channelsModel({
        group_id,
        channel_id,
        guild_id,
        operation,
    }).save();
}

async function canncelAllowedChannelId(channel_id, operation, group_id = null) {
    await channelsModel
        .deleteOne({ channel_id, group_id, operation })
        .then((res) => {
            console.log(res.data);
        });
}

export { getAllowedChannelId, pushAllowedChannelId, canncelAllowedChannelId };
