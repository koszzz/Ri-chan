const WxVoice = require("wx-voice");
var voice = new WxVoice();
voice.on("error", (err) => {});
[
    "ふわふわ時間 Cover by Liyuu"
].forEach((name) => {
    voice.encode(
        `./origin/${name}.mp3`,
        `./silk/${name}.silk`,
        { format: "silk" },
        (file) => console.log(file)
    );
});
