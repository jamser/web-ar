import nipplejs from 'nipplejs'  // 摇杆
import { changeAction } from '../utils/util'
import { emitControl } from './networking'

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
	var m = this;
	this.manager
	  .on('start', function (evt, data) {
		window.mylastAnimation = window.me.animation
		emitControl({animation: 'Walk'})
		changeAction(window.mylastAnimation, 'Walk') //from to
		m.time = setInterval(() => {
		  m.onStart && m.onStart(m.distance,m.angle,m.vector);
		}, 100);
	  })
	  .on('move', function (evt, data) {
		// direction有不存在的情况 
		if (data.direction) {
		  m.angle = data.direction.angle;
		  m.distance = data.distance;
		  m.vector = data.vector;
		}
	  })
	  .on('end', function (evt, data) {
		window.mylastAnimation = window.me.animation
		emitControl({animation: 'Idle'})
		changeAction(window.mylastAnimation, 'Idle') //from to
		clearInterval(m.time);
		m.onEnd && m.onEnd();
	  });
  }