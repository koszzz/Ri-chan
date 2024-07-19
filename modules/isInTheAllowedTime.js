import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);

const isInTheAllowedTime = (group_id) => {
    if (!["DA863706233CF44DCB4B8EE105101591"].includes(group_id)) {
        return true;
    }
    const now = dayjs(); // 获取当前时间
    const zero = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
    const nine = dayjs().set("hour", 9).set("minute", 0).set("second", 0);
    const seventeen = dayjs().set("hour", 17).set("minute", 0).set("second", 0);
    const eighteen = dayjs().set("hour", 18).set("minute", 0).set("second", 0);
    const isBetweenMorning = now.isBetween(zero, nine, "hour", "[)"); // 判断当前时间是否在0:00-9:00之间
    const isBetweenEvening = now.isBetween(seventeen, eighteen, "hour", "[)"); // 判断当前时间是否在17:00-18:00之间
    return isBetweenMorning || isBetweenEvening;
};

export { isInTheAllowedTime };
