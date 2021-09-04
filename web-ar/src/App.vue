<template>
  <div style='position: absolute; top: 10px; width:100%; text-align: center; z-index: 1;'>
    <div id="Stats-output" class="stats"></div>
  </div>
  <div class="joy-con" id="joy-con" :style="joyStyle"></div>
  <div v-if="visible" :style="allHover">
    <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">载入中{{percent}}</span>
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
import useImportModel from './js/useImportModel.js'
import useRenderFcts from './js/useRenderFcts.js'
import useAnimationFrame from './js/useAnimationFrame.js'

import Bus from './js/bus.js'
import { defineComponent, onMounted, toRefs, reactive } from 'vue'

export default defineComponent({
  name: '',
  setup: () => {
    
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
       percent: '0%'
    })

    Bus.$on('hide', (pert)=>{
      state.visible = false
      state.percent = pert
    })

    const { stats } = useStats() // 监控
    const { renderer } = useRenderer()  // 渲染器
    
    // 初始化场景，光，环境光，相机
    useInit()

    // arToolkit
    useArToolkit(renderer)

    // 追踪控制器
    useArMakerControls()

    // 载入模型
    useImportModel()

    // 循环渲染数组
    state.onRenderFcts = useRenderFcts(state.onRenderFcts, renderer)

    // 帧率监测
    useAnimationFrame(state.onRenderFcts, stats)

    onMounted(()=>{
      const speed = 3
      const J = new Joystick({
        zone: $('#joy-con')
      }).init()

    

      J.onStart = function(distance, angle, vector){
        const speed = 0.05
        const vx = window.aim.position.x - vector.x * speed
        const vy = window.aim.position.y
        const vz = window.aim.position.z + vector.y * speed
        window.aim.lookAt(new THREE.Vector3(vx, vy, vz))
        window.aim.rotateX(Math.PI / 2)
        window.aim.position.set(vx, vy ,vz)
      }


    })

    return { 
      ...toRefs(state)
    }
  }
})
</script>

<style lang='less' scoped>
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
</style>