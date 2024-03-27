import sleep from "./sleep.js";
import { getFileInfo, invalidate } from "./getFileInfo.js";

async function callWithRetry(functionToCall, args, retries = 0, errors = []) {
    const retryTime = 5;
    try {
        // 尝试调用函数并返回结果
        const result = await functionToCall(...args);
        return { result, errors };
    } catch (err) {
        // 如果出现错误，记录错误信息并添加到错误数组中
        if (typeof err == "object") errors.push(JSON.stringify(err));
        else errors.push(String(err));

        // 富媒体信息转存失败时，重新转存
        if (err?.code == 40034004 && args?.[1]?.media) {
            const oldFileInfo = args[1].media.file_info;
            const { url, group_openid } = invalidate(oldFileInfo);
            const { file_info } = await getFileInfo(group_openid, url, true);
            args[1].media.file_info = file_info;
        }

        // 判断是否需要重试
        if (retries < retryTime - 1) {
            // 如果需要重试，等待一段时间后再次调用函数
            await sleep(500);
            return await callWithRetry(functionToCall, args, ++retries, errors);
        } else {
            // 如果不需要重试，记录错误信息并抛出异常
            if (args && args[0] && args[0].imageFile)
                args[0].imageFile = {
                    type: "Buffer",
                    length: args[0].imageFile.length,
                };
            console.log(JSON.stringify({ errors: errors, args: args }));
        }
    }
}

export default callWithRetry;
