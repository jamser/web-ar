<template>
  <div style='position: absolute; top: 10px; width:100%; text-align: center; z-index: 1;'>
    <div id="Stats-output"></div>
    <a href="https://github.com/jeromeetienne/AR.js/" target="_blank">AR.js</a> - three.js camera transform
    <br/>
    Contact me any time at <a href='https://twitter.com/jerome_etienne' target='_blank'>@jerome_etienne</a>
  </div>
  <div class="button" id="walk">走路</div>
</template>

<script>
import useStats from './js/useStats.js'
import useRenderer from './js/useRenderer.js'
import useInit from './js/useInit.js'
import useArToolkit from './js/useArToolkit.js'
import useArMakerControls from './js/useArMakerControls.js'
import useImportModel from './js/useImportModel.js'
import useRenderFcts from './js/useRenderFcts.js'
import useAnimationFrame from './js/useAnimationFrame.js'

import { defineComponent, onMounted, toRefs, reactive } from 'vue'

export default defineComponent({
  name: '',
  setup: () => {

    const state = reactive({
       // array of functions for the rendering loop 呈现循环的函数数组
       onRenderFcts: [],
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
      const btn = document.querySelector('#walk')
      // 红线z 蓝线y 绿线x
      btn.addEventListener('click',()=>{
        window.dog.position.set(0, 0, window.dog.position.z + 0.2)
      })
    })

    return { 
      ...toRefs(state)
    }
  }
})
</script>

<style lang='less' scoped>
  .button {
    width: 100px;
    height: 40px;
    right: 10px;
    position: absolute;
    z-index: 9999;
    background-color: skyblue;
  }
</style>