// server.js
// 引入各种模块
const express = require('express')
const socketio = require('socket.io');
const fs = require('fs')
const http = require('http')
const https = require('https')
const app = express();

const Socket = require('./core/socket');
const Game = require('./core/game');

app.use(express.static('../dist'))

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