import useImportModel from './useImportModel.js'

// 需要加载的资源
const ASSET_NAMES = [
	'knight.glb',
	'Soldier.glb'
  ]
  

const assets = {};
const mixerHub = {};
const animationsHub = {};
const actionHub = {};

// 每一张图片都是通过promise进行加载的，所有图片加载成功后，Promise.all就会结束
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset))

function downloadAsset(assetName){
return new Promise(resolve => {
	useImportModel(`obj/${assetName}`).then((gltf)=>{

			console.log(`Downloaded ${assetName}`)
			assets[assetName] = gltf.scene.children[0];
	
			let animations = {};
	
			gltf.animations.forEach( (anim)=>{
				animations[anim.name] = anim;
			})
	
			animationsHub[assetName] = animations
	
			console.log(animationsHub)

			assets[assetName].up = new THREE.Vector3(0, 1, 0)
	
			assets[assetName].position.set(0,0,0)
			// gltf.scene.scale.set(0.01,0.01,0.01)
			// aim.lookAt(new THREE.Vector3(0,1,0))
	
			actionHub[assetName] = assetName === "knight.glb" ? ["Walk", "Dance", "Idle", "Die"] : null
			actionHub[assetName] = assetName === "Soldier.glb" ? ["Walk", "Run", "Idle", "TPose"] : null

			// 调用动画
			// mixerHub[assetName] = new THREE.AnimationMixer( assets[assetName] ); 
			// window.curAction = mixer.clipAction( window.animations[window.actionName] ).setDuration(1).play();
			
			// const axes = new THREE.AxisHelper(10); // 坐标轴不需要
	
			// window.scene.add(axes)
			// window.scene.add(assets[assetName])
	
			// console.log(aim)
			// gltf.animations; // Array<THREE.AnimationClip>
			// gltf.scene; // THREE.Scene
			// gltf.scenes; // Array<THREE.Scene>
			// gltf.cameras; // Array<THREE.Camera>
			// gltf.asset; // Object
	})
	
	resolve();
})
}

export const downloadAssets = () => downloadPromise
export const getAsset = (id, assetName) => {
	if(!window[`assets_${id}`]){
		window[`assets_${id}`] = THREE.SkeletonUtils.clone(assets[assetName]) // 由基础物体克隆出来
		window[`assets_${id}`].up = new THREE.Vector3(0, 1, 0)
		window[`assets_${id}`].position.set(0,0,0)
		mixerHub[`${id}`] = new THREE.AnimationMixer(window[`assets_${id}`])
	}
	return window[`assets_${id}`]
} 

export const getMixer = id => mixerHub[id]
export const getAnimations = assetName => animationsHub[assetName]
export const getAction = assetName => actionHub[assetName]