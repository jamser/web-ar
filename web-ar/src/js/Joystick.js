import nipplejs from 'nipplejs'  // 摇杆
import { changeAction } from '../utils/util'

export default function Joystick(opt) {
	if (!opt.zone) return;
	// var disabledColor = opt && opt.disabledColor || true;
  
	this.options = {
	  mode: opt && opt.mode || 'static',
	  size: opt && opt.size || 150,
	  // color在nipplejs中是设置backgroundColor，为了让我们样式不被覆盖。所以设置一个让background-color不成功的值
	//   color: disabledColor ? 'ddd' : (opt && opt.color || '#eee'),
	  position: opt && opt.position || {
		left: '50%',
		top: '50%'
	  },
	  zone: opt && opt.zone
	};
  
	this.distance = 0;
	this.angle = null;
	this.time = null;
  }
  
  Joystick.prototype.init = function() {
	var manager = nipplejs.create(this.options);
	this.manager = manager;
	this._on();
	return this;
  }
  
  Joystick.prototype._on = function() {
	var me = this;
	this.manager
	  .on('start', function (evt, data) {
		changeAction('Walk')
		me.time = setInterval(() => {
		  me.onStart && me.onStart(me.distance,me.angle,me.vector);
		}, 100);
	  })
	  .on('move', function (evt, data) {
		// direction有不存在的情况 
		if (data.direction) {
		  me.angle = data.direction.angle;
		  me.distance = data.distance;
		  me.vector = data.vector;
		}
	  })
	  .on('end', function (evt, data) {
		changeAction('Idle')
		clearInterval(me.time);
		me.onEnd && me.onEnd();
	  });
  }