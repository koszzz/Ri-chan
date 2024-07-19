import { client } from "./bot.js";
import callWithRetry from "./callWithRetry.js";
import dayjs from "dayjs";

let files = {
    "https://cdn.liyuu.ceek.fun/images/dame.jpg": {
        group_openid: "", // 群聊id
        file_info: "", // 文件信息，用于发消息接口的 media 字段使用
        ttl: 1, // 有效期，表示剩余多少秒到期，到期后 file_info 失效，当等于 0 时，表示可长期使用
        createdTime: "1997-01-09T00:00:00.000Z", // 上传时间，ISO 8601 格式
    },
};

/**
 * 获取file_info，发送图片
 * @param {string} group_openid 群聊id
 * @param {string} url 图片url
 * @param {boolean=} forceUpdate 是否强制更新，默认false
 * @param {boolean=} type 文件格式，默认1图片
 * @returns {Object}
 *     {
 *         "file_info": "CsMFErUDCp8DCuQBCoUBCKnyJBIgNDA2ZDgyMmFlYTllMmFjODA3Njk3YWEzMjg5MjZhZTMaKDUwYWRiZDhlNTlkNWRmZTYzMzc3MjUyYTJlMGUzNWY0ZWM0ZWM2ZjkiJDQwNmQ4MjJhZWE5ZTJhYzgwNzY5N2FhMzI4OTI2YWUzLnBuZyoFCAEQ6QcwxyA4wR1IARJKQ2dvek9EZzVNREV6TlRRekVoUlFyYjJPV2RYZjVqTjNKU291RGpYMDdFN0ctUmlwOGlRZ193b295UGUxNHFxeGhBTlFnTDJqQVEYASDCtcCuBiiAvaMBOP8KEqIBCmYvZG93bmxvYWQ/YXBwaWQ9MTQwNyZmaWxlaWQ9Q2dvek9EZzVNREV6TlRRekVoUlFyYjJPV2RYZjVqTjNKU291RGpYMDdFN0ctUmlwOGlRZ193b295UGUxNHFxeGhBTlFnTDJqQVESHwoHJnNwZWM9MBIJJnNwZWM9NzIwGgkmc3BlYz0xOTgaF211bHRpbWVkaWEubnQucXEuY29tLmNuKAEyD7AGAcAMAtIMBgjJhbPcAhIRCg3IPgLQPgLYPoO2h7sLUAEaiAISJDQwNmQ4MjJhZWE5ZTJhYzgwNzY5N2FhMzI4OTI2YWUzLnBuZziDtoe7C1DpB2oQQG2CKuqeKsgHaXqjKJJq46AB6QewAccguAHBHcgBqfIk0AEBkgKvAQgASgDyAacBL2Rvd25sb2FkP2FwcGlkPTE0MDcmZmlsZWlkPUNnb3pPRGc1TURFek5UUXpFaFJRcmIyT1dkWGY1ak4zSlNvdURqWDA3RTdHLVJpcDhpUWdfd29veVBlMTRxcXhoQU5RZ0wyakFRJnJrZXk9Q0FJU0tLU0Jla2pWRzFmTVQ0NGh1X0dyaE5sNTJiWXRYSDhmOGJJZDdJNDdRSmZ1YlJKNnRzTzBMNkEQAQ=="
 *     }
 */
const getFileInfo = async (
    group_openid,
    url,
    forceUpdate = false,
    type = 1
) => {
    // 如果还有60s的有效期，或无限期
    if (
        !forceUpdate &&
        files[url] &&
        (files[url].ttl == 0 ||
            dayjs(files[url].createdTime)
                .add(files[url].ttl, "seconds")
                .isAfter(dayjs().add(60, "seconds")))
    ) {
        return { file_info: files[url].file_info };
    }
    if (forceUpdate) {
        console.log("【强制转存】");
    }
    const fileRes = await callWithRetry(
        async (file_type, url, group_openid) =>
            await client.groupApi
                .postFile(group_openid, {
                    file_type,
                    url,
                    srv_send_msg: false, // 设置为 false 不发送到目标端，仅拿到文件信息
                })
                .then((res) => res.data),
        [type, url, group_openid]
    ).then((result) => result?.result ?? "exit");
    if (fileRes == "exit") {
        return { file_info: "" };
    }
    const { file_info, ttl } = fileRes;
    if (url.startsWith("https://cdn.liyuu.ceek.fun/images/")) {
        files[url] = {
            group_openid,
            file_info,
            ttl,
            createdTime: dayjs().toISOString(),
        };
    }

    return { file_info };
};

/**
 * 使某个文件缓存失效
 * @param {string} file_info
 * @returns {Object} { url: "文件源url", group_openid: "转存时的group openid"}
 */
const invalidate = (file_info) => {
    for (const [url, fileInfo] of Object.entries(files)) {
        if (fileInfo.file_info === file_info) {
            fileInfo.createdTime = "1997-01-09T00:00:00.000Z";
            fileInfo.ttl = 1;
            const { group_openid } = fileInfo;
            return { url, group_openid };
        }
    }
};

export { getFileInfo, invalidate };
