import * as cron from "node-cron";
import { getAllowedChannelId } from "../allowChannels/publicApi.js";
import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";
import getFileInfo from "../getFileInfo.js";

export default () => {
    cron.schedule("0 0 8 * * *", async () => {
        const goodMorningChannelId = await getAllowedChannelId(
            -1,
            "goodMorning"
        );

        if (goodMorningChannelId.length == 0) {
            return;
        }
        goodMorningChannelId.forEach(async (i) => {
            const type = i.group_id ? "group" : "guild";
            callWithRetry(postMessage, [
                type == "guild" ? i.channel_id : i.group_id,
                {
                    content:
                        "早安宝子们！\n新的一天也不要忘记“/看鲤”哦~\n小鲤一直陪着大家呢！",
                    image:
                        type == "guild"
                            ? "https://cdn.liyuu.ceek.fun/images/morning.jpg"
                            : undefined, //早安
                    media:
                        type == "group"
                            ? await getFileInfo(
                                  i.group_id,
                                  "https://cdn.liyuu.ceek.fun/images/morning.jpg"
                              )
                            : undefined,
                    msg_type: 7,
                },
                (res) => {
                    console.log(res.data);
                },
                type,
            ]);
        });
    });
};
