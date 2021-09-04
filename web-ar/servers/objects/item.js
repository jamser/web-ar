// 所有游戏对象都要继承的类，它定义了游戏世界里每一个元素的基本属性
class Item{
	constructor(data = {}){
	  // id
	  this.id = data.id;
	  // 位置
	  this.x = data.x;
	  this.y = data.y;
	  this.z = data.z;
	  // 大小
	  this.w = data.w;
	  this.h = data.h;
	}
  
	// 这里是物体每帧的运行状态
	update(dt){
	
	}
  
	// 格式化数据以方便发送数据给前端
	serializeForUpdate(){
	  return {
		id: this.id,
		x: this.x,
		y: this.y,
		z: this.z,
		w: this.w,
		h: this.h
	  }
	}
  }
  
  module.exports = Item;