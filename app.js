import allowChannels from './modules/allowChannels/index.js'
import goodMorning from './modules/goodMorning/index.js'
import meetLiyuu from './modules/meetLiyuu/index.js'
import randomNumber from './modules/randomNumber/index.js'

async function main() {
    allowChannels()
    goodMorning()
    meetLiyuu()
    // randomNumber()
}
try {
    main()
} catch (err) {
    console.log(`运行主函数时出现问题${err}`)
}