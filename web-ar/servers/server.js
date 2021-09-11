// server.js
// 引入各种模块
const express = require('express')
const socketio = require('socket.io');
const ApiSpeech = require('./aip-node-sdk-4.15.5').speech
const multiparty = require('multiparty')
const fs = require('fs')
// const http = require('http')
const https = require('https')
const app = express();

const Socket = require('./core/socket');
const Game = require('./core/game');

// sdk
let client = new ApiSpeech(24829593, 'iiGChk4TYNgEpcobG8fLsDPG', 'Qv3hPQMBrOgPR9XepK4jRO3sgUDR0ULm')

app.use(express.static('../dist'))

// app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: 'audio/wav', limit: '50mb' }));

// app.post('/api/audio',function(req,res){  
//   console.log(req.body);    
//   res.send('POST发送成功了')
// })

app.post('/api/audio', function(req, res){
	let form = new multiparty.Form({uploadDir: './audios'})
  console.log('deal...')
  form.parse(req,(err, fields, files) => {
    if(err) {console.log(err); return}
    console.log(files)
    const time = new Date().getTime()
    const fileOriginalFilename = files.audioData[0].originalFilename + time + '.wav';
    const filePath = files.audioData[0].path;
    const dstPath = './audios/' + fileOriginalFilename;
    fs.rename(filePath, dstPath, function (err) {
        if (err) {
            console.log('rename error: ' + err);
            return
        } else {
          let voice = fs.readFileSync('./audios/' + fileOriginalFilename);
          let voiceBase64 = new Buffer.from(voice);
          client.recognize(voiceBase64, 'wav', 16000).then(function(result) {
              console.log('结果: ' + result.result[0]);
              res.send(result.result[0])
              fs.unlinkSync('./audios/' + fileOriginalFilename)
          }, function(err) {
              console.log(err);
          });
        }
    });
  })
})


// 语音合成，保存到本地文件
// client.text2audio('我是合成出来的声音呀', {spd: 0, per: 4}).then(function(result) {
//     if (result.data) {
//         console.log('语音合成成功，文件保存到tts.mp3，打开听听吧');
//         fs.writeFileSync('tts.mp3', result.data);
//     } else {
//         // 合成服务发生错误
//         console.log('语音合成失败: ' + JSON.stringify(result));
//     }
// }, function(err) {
//     console.log(err);
// });


// 启动服务
// const port = process.env.PORT || 80;
// const server = http.createServer(app).listen(80, () => {
//   console.log('Server Listening on port: ' + port)
// })

const httpsOption = {
    key : fs.readFileSync("./https/private.key"),
    cert: fs.readFileSync("./https/cert.pem")
}
const safePort = 443;
const server_safe = https.createServer(httpsOption, app).listen(safePort, () => {
	console.log('Server https on port: ' + safePort)
})

// 实例游戏类
const game = new Game;

// 监听socket服务
// const io = socketio(server)
const io = socketio(server_safe)
// 将游戏以及io传入创建的socket类来统一管理
const socket = new Socket(game, io);

// 监听连接进入游戏的回调
io.on('connect', item => {
  socket.listen(item)
})