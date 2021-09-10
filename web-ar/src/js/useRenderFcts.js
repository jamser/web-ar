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
			const { lookAt, id, vx = 0, vy = 0, vz = 0, rotationZ } = player;
			
			if(me === player){
				me && (window.me = me)  // 数据相关
				if(!meHasRendered){
					window.myself = getAsset(me.id, me.modelName, me.username)  // 自身模型
					window.scene.add(myself)
					meHasRendered = true
				}
				window.myself.position.set(vx, vy ,vz)
			}else{
				id && (window[`_${id}`] = player)
				if(!othersHasRendered[`${id}`]){
					window[`other_${id}`] = getAsset(player.id, player.modelName, player.username)
					window.scene.add(window[`other_${id}`])
					othersHasRendered[`${id}`] = true
					window.ids.push(id)
				}
				window[`other_${id}`].position.set(vx, vy, vz)
				if(!(lookAt.x === 0 || lookAt.y === 0 || lookAt.z === 0)){
					// console.log(lookAt)
					window[`other_${id}`].lookAt(new THREE.Vector3(lookAt.vx * 50, lookAt.vy * 50, lookAt.vz * 50))
				}else{
					window[`other_${id}`].rotation.z = rotationZ
				}
			}

			!window[`mixer_${id}`] && (window[`mixer_${id}`] = getMixer(player.id))
			
			if(window[`mixer_${id}`]){
				window[`mixer_${id}`].update(delta);
			}

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