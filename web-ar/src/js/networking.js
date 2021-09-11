import io from 'socket.io-client'
import { processGameUpdate } from './state';
import { $ } from '../utils/util'

const Constants = {
  MSG_TYPES: {
	  JOIN_GAME: 1,
	  UPDATE: 2,
	  INPUT: 3,
    DELETE: 4,
    ADD_MSG: 5,
    TALK_BOARD: 6
	}
}

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

    socket.on(Constants.MSG_TYPES.UPDATE, processGameUpdate)
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      alert('与服务器断开连接...')
    })

    // 删除下线的小朋友
    socket.on(Constants.MSG_TYPES.DELETE, (id) => {
      if(id){
        console.log('玩家：'+ id +'已经下线')
        scene.remove(window[`other_${id}`])
        window.ids.splice(window.ids.findIndex(x => x == id), 1)
        window[`_${id}`] && (delete window[`_${id}`])
        window[`other_${id}`] && (delete window[`other_${id}`])
      }
    })

    socket.on(Constants.MSG_TYPES.TALK_BOARD, (allMsgs) => {
      // console.log('hello')
      // console.log(allMsgs)
      let ms = allMsgs
      if(allMsgs.length > 20){
        ms = ms.slice(-20)
      }
      ms = ms.map(item => `<p style="color: white;">${item}</p>`)
      // console.log('ms' + ms)
      $('#talkDialog').innerHTML = ms.join('')
      $('#talkDialog').scrollTop = $('#talkDialog').scrollHeight
    })
  })
}

export const play = (username, modelName) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username, modelName)
}

export const sendMsg = (username, msg) => {
  socket.emit(Constants.MSG_TYPES.ADD_MSG, `${username}: ${msg}`)
}
