const express = require('express')
const app = express()
const request = require('request')
const Base64 = require('js-base64').Base64
app.listen(3109, () => {
    console.log('ok!')
})
app.get('/picture', (req, res) => {
    const url=decodeURIComponent(req.query.url)
    const options = {
        method:"GET",
        url,
        headers:{
            "Referer": "https://m.weibo.cn/"
        }
    };
    request(options).on('error', (err)=>{
        console.log(err);
    }).pipe(res);
})

app.get('/pic', (req, res) => {
    const url=decodeURIComponent(Base64.decode(req.query.url))
    const options = {
        method:"GET",
        url,
        headers:{
            "Referer": ""
        }
    };
    request(options).on('error', (err)=>{
        console.log(err);
    }).pipe(res);
})

app.get('/102062756.json', (req, res) => {
    res.json({bot_appid:102062756})
})