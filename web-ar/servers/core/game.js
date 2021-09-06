// core/game.js
const Player = require('../objects/player.js')
const Constants = require('../../shared/constants.js')

class Game{
	constructor(){
	  // 保存玩家的socket信息
	  this.sockets = {}
	  // 保存玩家的游戏对象信息
	  this.players = {};
	  // 最后一次执行时间
	  this.lastUpdateTime = Date.now();
	  // 是否发送给前端数据，这里将每两帧发送一次数据
	  this.shouldSendUpdate = false;
	  // 游戏更新
	  setInterval(this.update.bind(this), 1000 / 60);
	}
  
	update(){
		const now = Date.now();
		// 现在的时间减去上次执行完毕的时间得到中间间隔的时间
		const dt = (now - this.lastUpdateTime) / 1000;
		this.lastUpdateTime = now;

		// console.log(this.players)

		 // 更新玩家人物
		 Object.keys(this.players).map(playerID => {
			const player = this.players[playerID];
			// console.log(player)
			player.update(dt);
		  })
	  
		  if(this.shouldSendUpdate){
			// 发送数据
			Object.keys(this.sockets).map(playerID => {
			  const socket = this.sockets[playerID];
			  const player = this.players[playerID];
			  
			  socket.emit(
				  Constants.MSG_TYPES.UPDATE,
				  // 处理游戏中的对象数据发送给前端
				  this.createUpdate(player)
			  )
			})
	  
			this.shouldSendUpdate = false;
		  } else {
			this.shouldSendUpdate = true;
		  }
	}

	createUpdate(player){
		// console.log('player',player)
		// 其他玩家
		const otherPlayer = Object.values(this.players).filter(
			p => p !== player
		);
	
		return {
		  t: Date.now(),
		  // 自己
		  me: player.serializeForUpdate(),
		  others: otherPlayer
		}
	}
  
	// 玩家加入游戏
	joinGame(socket, username = 'xx', modelName = 'knight.glb'){
		console.log('joinGame')
		this.sockets[socket.id] = socket;
	
		// 玩家位置0,0,0
		const x = 0
		const y = 0
		const z = 0

		this.players[socket.id] = new Player({
		  id: socket.id,
		  username,
		  x, y, z,
		  modelName
		})

		console.log(this.players)
		console.log('当前人数'+ Object.keys(this.players).length)
	}

	handleInput(socket, data){
		// console.log(socket.id)
		// console.log(data)
		const player = this.players[socket.id];
		if(player){
			if(data.vx){
				this.players[socket.id].x = data.vx
				this.players[socket.id].vx = data.vx
			}
			if(data.vy){
				this.players[socket.id].y = data.vy
				this.players[socket.id].vy = data.vy
			}
			if(data.vz){
				this.players[socket.id].z = data.vz
				this.players[socket.id].vz = data.vz
			}
			if(data.lookAt){
				if(data.lookAt.vx || data.lookAt.vy || data.lookAt.vz){
					this.players[socket.id].lookAt = data.lookAt
				}
			}
			data.rotateX && (this.players[socket.id].rotateX = data.rotateX)
			data.animation && (this.players[socket.id].animation = data.animation)
		}
	}

  
	// 玩家断开游戏
	disconnect(socket){
		delete this.sockets[socket.id];
		delete this.players[socket.id];

		console.log(this.players)
		console.log('当前人数'+ Object.keys(this.players).length)
	}
  }
  
module.exports = Game;