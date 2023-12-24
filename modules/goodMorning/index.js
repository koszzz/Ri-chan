import * as cron from "node-cron";
import { getAllowedChannelId } from "../allowChannels/publicApi.js";
import callWithRetry from '../callWithRetry.js'
import postMessage from '../postMessage.js'

export default () => {
    cron.schedule("0 0 8 * * *", async () => {
        const goodMorningChannelId = await getAllowedChannelId(
            -1,
            "goodMorning"
        );

        if (goodMorningChannelId.length) {
            goodMorningChannelId.forEach(async (i) => {
                callWithRetry(postMessage, [
                    i.channel_id,
                    {
                        content:
                            "早安宝子们！\n新的一天也不要忘记“/看鲤”哦~\n小鲤一直陪着大家呢！",
                        image: "https://cdn.liyuu.ceek.fun/images/morning.jpg", //早安
                    },
                    (res) => {
                        console.log(res.data);
                    },
                ]);
            });
        }
    });
};
