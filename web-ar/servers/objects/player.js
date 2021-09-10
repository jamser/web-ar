const Item = require('./item')
const Constants = require('../../shared/constants')

/**
 * 玩家对象类
 */
class Player extends Item {
  constructor(data){
    super(data);
    this.modelName = data.modelName || 'knight.glb';
    this.username = data.username;
    this.rotateX = data.rotateX || 0;
    this.rotateY = data.rotateY || 0;
    this.rotateZ = data.rotateZ|| 0;
    this.lookAt = data.lookAt || {vx: 0, vy: 0, vz: 0};
    this.vx = data.vx || 0;
    this.vy = data.vy || 0;
    this.vz = data.vz || 0; 
    this.rotationZ = data.rotationZ || 0;
    this.animation = data.animation || 'Idle';
    this.speed = ['ybot.fbx', 'xbot.fbx'].includes(this.modelName) ? 0.3 : Constants.PLAYER.SPEED;
  }

  update(dt){
    // console.log(dt)
  }

  serializeForUpdate(){
    return {
      ...(super.serializeForUpdate()),
      username: this.username,
      speed: this.speed,
      modelName: this.modelName,
      vx: this.vx,
      vy: this.vy,
      vz: this.vz,
      animation: this.animation,
      lookAt: this.lookAt,
      rotateX: this.rotateX,
      rotateY: this.rotateY,
      rotateZ: this.rotateZ,
      rotationZ: this.rotationZ
    }
  }
}

module.exports = Player;