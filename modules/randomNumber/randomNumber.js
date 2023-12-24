import callWithRetry from '../callWithRetry.js'
import postMessage from '../postMessage.js'

async function randomNumber(msg_id, channel_id, author, input) {
    function generateSumOfRandomNumbers(input) {
        let [x, y] = input.split('d').map(Number);
        let sum = 0;
        for (let i = 0; i < x; i++) {
            sum += Math.floor(Math.random() * y) + 1;
        }
        return sum;
    }
    callWithRetry(postMessage, [channel_id, {
        content: `<@!${author}> 宝子~生成结果是${generateSumOfRandomNumbers(input)}`,
        msg_id,
    }, (res => {
        console.log(res.data)
    })]);
}

export default randomNumber