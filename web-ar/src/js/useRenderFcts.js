import { getCurrentState } from './state'
import { getAsset, getMixer } from './assets'


let meHasRendered = false
let othersHasRendered = {}

const useRenderFcts = (onRenderFcts, renderer) => {
	let newonRenderFcts = onRenderFcts

	// update artoolkit on every frame
    onRenderFcts.push(function(){
        if( arToolkitSource.ready === false )	return
        arToolkitContext.update( arToolkitSource.domElement )
        // update scene.visible if the marker is seen
        scene.visible = camera.visible
    })

	newonRenderFcts.push((delta)=>{
		const { me, others } = getCurrentState();
		if(!me){
			return;
		}

		renderPlayer(me, me);
  		others.forEach(renderPlayer.bind(null, me));

		function renderPlayer(me, player){
			const { username, id, vx = 0, vy = 0, vz = 0, rotationZ } = player;
			
			if(me === player){
				me && (window.me = me)  // 数据相关
				if(!meHasRendered){
					window.myself = getAsset(me.id, me.modelName)  // 自身模型
					window.scene.add(myself)
					meHasRendered = true
				}
				window.myself.position.set(vx, vy ,vz)
			}else{
				id && (window[`_${id}`] = player)
				if(!othersHasRendered[`${id}`]){
					window[`other_${id}`] = getAsset(player.id, player.modelName)
					window.scene.add(window[`other_${id}`])
					othersHasRendered[`${id}`] = true
					window.ids.push(id)
				}
				window[`other_${id}`].position.set(vx, vy, vz)
				window[`other_${id}`].rotation.z = rotationZ
			}

			!window[`mixer_${id}`] && (window[`mixer_${id}`] = getMixer(player.id))
			
			if(window[`mixer_${id}`]){
				window[`mixer_${id}`].update(delta);
			}

			// // 绘制玩家的名称
			// ctx.fillStyle = 'white'
			// ctx.textAlign = 'center';
			// ctx.font = "20px '微软雅黑'"
			// ctx.fillText(player.username, canvasX, canvasY - PLAYER.RADUIS - 16)
		  }
	})

	//render the whole thing on the page
	// render the scene
	newonRenderFcts.push(function(){
		renderer.render( scene, camera );
	});


	return newonRenderFcts
}


export default useRenderFcts