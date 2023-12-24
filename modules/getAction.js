export default (content) => {
    // 定义关键词列表
    const keywords = [
        "结束看鲤",
        "设置看鲤子频",
        "取消看鲤子频",
        "查看看鲤子频",
        "看鲤",
        "查看积分",
        "设置早安",
        "取消早安",
        "查看早安子频",
    ];

    // 将关键词列表倒序排序
    keywords.sort((a, b) => b.length - a.length);

    // 从长度长的关键词开始判断
    for (const keyword of keywords) {
        if (content.includes(keyword)) {
            return keyword;
        }
    }

    // 如果以上都不触发，则判断正则表达式
    const regex = /\d+d\d+/;
    if (regex.test(content)) {
        return "randomNumber";
    }

    // 否则返回默认值
    return "hello";
};
