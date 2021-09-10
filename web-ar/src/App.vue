<template>
  <div style='position: absolute; top: 10px; width:100%; text-align: center; z-index: 1;'>
    <div id="Stats-output" class="stats"></div>
  </div>
  <div class="joy-con" id="joy-con" :style="joyStyle"></div>
  <div v-if="visible" :style="allHover">
    <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;">{{percent}}</span>
  </div>
  <div v-if="show" :style="allHover">
    <div id="playerInfo" class="playerInfo" @click.stop>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="userName"
            name="userName"
            label="昵称:"
            placeholder="请输入昵称"
            :rules="[{ required: true, message: '请输入昵称' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :disabled="disabled">
            {{percent}}
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import Joystick from './js/Joystick.js'
import { $ } from './utils/util'
import useStats from './js/useStats.js'
import useRenderer from './js/useRenderer.js'
import useInit from './js/useInit.js'
import useArToolkit from './js/useArToolkit.js'
import useArMakerControls from './js/useArMakerControls.js'
import useOthersAnimationControl from './js/useOthersAnimationControl.js'
import useRenderFcts from './js/useRenderFcts.js'
import useAnimationFrame from './js/useAnimationFrame.js'

import { changeAction } from './utils/util.js'
import { play, emitControl } from './js/networking.js'
import Bus from './js/bus.js'
import { ASSET_NAMES, ANIMATIONS } from './common/common.js'
import { defineComponent, onMounted, toRefs, reactive, ref } from 'vue'

export default defineComponent({
  name: '',
  setup: () => {
    window.ids = [] // 其他玩家id集合
    const objsHub = ASSET_NAMES // 模型集合

    const userName = ref('')
    const show = ref(true)
    
    const state = reactive({
       // array of functions for the rendering loop 呈现循环的函数数组
       joyStyle: {
         position: 'absolute',
         top: document.documentElement.clientHeight + 'px',
         left: (document.documentElement.clientWidth / 2) + 'px',
         transform: 'translateY(-100px)',
         'z-index': '9998'
       },
       allHover: {
         position: 'relative',
         height: document.documentElement.clientHeight + 'px',
         width: document.documentElement.clientWidth + 'px',
         "background-color": "rgba(0,0,0,0.5)",
         "z-index": "9999"
       },
       onRenderFcts: [],
       visible: true,
       percent: '0%',
       disabled: true
    })

    

    Bus.$on('number', (pert)=>{
      state.percent = `资源载入中：${pert}` 
      if(pert === '100%'){
        state.percent = '提交'
        state.disabled = false
      }
    })

    Bus.$on('hide', () => {
      state.visible = false
    })
    
    const { stats } = useStats() // 监控
    const { renderer } = useRenderer()  // 渲染器
    
    // 初始化场景，光，环境光，相机
    useInit()

    // arToolkit
    useArToolkit(renderer)

    // 追踪控制器
    useArMakerControls()

    // const dance = () => {
    //   window.mylastAnimation = window.me.animation
    //   emitControl({animation: 'Flair'})
    //   changeAction(window.me, window.mylastAnimation, 'Flair') //from to
    // }

    // 载入模型
    // useImportModel()
    const onSubmit = (values) => {
      console.log(values.userName)
      let rnumber = parseInt(Math.random() * objsHub.length)
      console.log(rnumber)
      play(values.userName, objsHub[rnumber])
      show.value = false
      setTimeout(()=>{
        // 循环渲染数组
        state.onRenderFcts = useRenderFcts(state.onRenderFcts, renderer)
        // 帧率监测
        useAnimationFrame(state.onRenderFcts, stats)
      }, 500)
    }

    onMounted(()=>{
      useOthersAnimationControl()  // 动画变化监听

      const J = new Joystick({
        zone: $('#joy-con')
      }).init()

      J.onStart = function(distance, angle, vector){
        // 红绿蓝 xyz
        let vx = window.me.x + vector.y * me.speed 
        let vy = window.me.y 
        let vz = window.me.z + vector.x * me.speed

        // console.log(vx, vy, vz)

        // 旋转角度赋值   
        if(window.myself){
          // 操控方式1
          if(['Soldier.glb'].includes(me.modelName)){
            if(vector.x > 0 && vector.y > 0){
              window.myself.rotation.z = (3 * Math.PI / 2 - Math.atan(vector.x / vector.y))
            }else if(vector.x < 0 && vector.y > 0){
              window.myself.rotation.z = (3 * Math.PI / 2 - Math.atan(vector.x / vector.y))
            }else if(vector.x < 0 && vector.y < 0){
              window.myself.rotation.z =  (Math.PI / 2 - Math.atan(vector.x / vector.y))
            }else if(vector.x > 0 && vector.y < 0){
              window.myself.rotation.z =  (Math.PI / 2 - Math.atan(vector.x / vector.y))
            }
            // 操控方式2
          }else if(['knight.glb'].includes(me.modelName)){
            if(vector.x > 0 && vector.y > 0){
              window.myself.rotation.z = (Math.atan(vector.x / vector.y) - Math.PI / 2)
            }else if(vector.x < 0 && vector.y > 0){
              window.myself.rotation.z = (Math.atan(vector.x / vector.y) - Math.PI / 2)
            }else if(vector.x < 0 && vector.y < 0){
              window.myself.rotation.z =  (Math.atan(vector.x / vector.y) + Math.PI / 2)
            }else if(vector.x > 0 && vector.y < 0){
              window.myself.rotation.z =  (Math.atan(vector.x / vector.y) + Math.PI / 2)
            }
          }else{
            window.myself.lookAt(new THREE.Vector3(vx, vy ,vz))
          }
        }

        emitControl({
          vx,
          vy,
          vz,
          lookAt: {vx, vy, vz},
          rotateX: 2,   // Math.PI / 2,
          rotationZ: window.myself.rotation.z
        })

      }
    })

    return { 
      ...toRefs(state),
      show,
      userName,
      onSubmit,
      dance
    }
  }
})
</script>

<style lang='less' scoped>
  .playerInfo{
    position: absolute;
    top: 300px;
    left: 12.5%;
    width: 75%;
    z-index: 9999
  }
  .hidden{
    display: none !important;
  }
  .joy-con {
    .front {
      background-color: #fff;
      user-select: none;//加这个属性是因为元素总是会被选中，会比较影响使用体验
    }
    .back {
      // background-image: url("../assets/j.png");
      // background-size: cover;
      user-select: none;
    }
  }
  ::v-deep .van-cell__title.van-field__label{
    width: 40px;
  }
</style>