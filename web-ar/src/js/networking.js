import io from 'socket.io-client'

// 这里判断是否是https，如果是https就需要使用wss协议
const socketProtocal = (window.location.protocol.includes('https') ? 'wss' : 'ws');
// 这里就进行连接并且不重新连接，这样可以制作一个断开连接的功能
const socket = io(`${socketProtocal}://${window.location.host}`, { reconnection: false })

const connectPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  })
})

// 发送信息给后端
export const emitControl = data => {
  socket.emit(Constants.MSG_TYPES.INPUT, data);
}

export const connect = onGameOver => {
  connectPromise.then(()=> {
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    })
  })
}
