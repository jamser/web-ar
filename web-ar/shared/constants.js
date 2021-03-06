// shared/constants.js
module.exports = Object.freeze({
	// 玩家的数据
	PLAYER: {
	  // 速度
	  SPEED: 0.2,
	},

	// socket发送消息的函数名
	MSG_TYPES: {
	  JOIN_GAME: 1,
	  UPDATE: 2,
	  INPUT: 3,
	  DELETE: 4,
	  ADD_MSG: 5,
	  TALK_BOARD: 6
	}
  })