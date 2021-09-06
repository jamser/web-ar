// 所有游戏对象都要继承的类，它定义了游戏世界里每一个元素的基本属性
class Item{
	constructor(data = {}){
	  this.username = data.username;
	  // id
	  this.id = data.id;
	  // 位置
	  this.x = data.x;
	  this.y = data.y;
	  this.z = data.z;
	}
  
	// 这里是物体每帧的运行状态
	update(dt){
	
	}
  
	// 格式化数据以方便发送数据给前端
	serializeForUpdate(){
	  return {
		username: this.username,
		id: this.id,
		x: this.x,
		y: this.y,
		z: this.z,
	  }
	}
  }
  
  module.exports = Item;