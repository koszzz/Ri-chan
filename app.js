import allowChannels from "./modules/allowChannels/index.js";
import goodMorning from "./modules/goodMorning/index.js";
import meetLiyuu from "./modules/meetLiyuu/index.js";
import randomNumber from "./modules/randomNumber/index.js";
import rockPaperScissors from "./modules/rockPaperScissors/index.js";
import sing from "./modules/sing/index.js";
import theFirstMessage from './modules/theFirstMessage/index.js'

async function main() {
    allowChannels();
    goodMorning();
    meetLiyuu();
    // randomNumber()
    rockPaperScissors();
    sing();
    // theFirstMessage()
}
try {
    main();
} catch (err) {
    console.log(`运行主函数时出现问题${err}`);
}
