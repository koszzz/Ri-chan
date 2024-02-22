import callWithRetry from "../callWithRetry.js";
import postMessage from "../postMessage.js";

async function randomNumber(
    msg_id,
    destinationId,
    author,
    input,
    type = "guild"
) {
    function generateSumOfRandomNumbers(input) {
        let [x, y] = input.split("d").map(Number);
        let sum = 0;
        for (let i = 0; i < x; i++) {
            sum += Math.floor(Math.random() * y) + 1;
        }
        return sum;
    }
    callWithRetry(postMessage, [
        destinationId,
        {
            content:
                (type == "guild" ? `<@!${author}> ` : "") +
                `宝子~生成结果是${generateSumOfRandomNumbers(input)}`,
            msg_id,
            msg_type: 0,
        },
        (res) => {
            console.log(res.data);
        },
        type,
    ]);
}

export default randomNumber;
