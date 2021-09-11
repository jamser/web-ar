import useImportModel from './useImportModel.js'
import { ASSET_NAMES, ANIMATIONS } from '../common/common.js'


const assets = {};
const mixerHub = {};
const animationsHub = {};
const animationsClipHub = {};
const actionHub = {};


const downloadAnims = Promise.all(ANIMATIONS.map(downloadAnim)).then(()=>{
	console.log(animationsHub)
	// // gltf注释掉下面三行
	ASSET_NAMES.map(item => {
		animationsClipHub[item] = animationsHub
	})
	console.log(animationsClipHub)
})

// 每一张图片都是通过promise进行加载的，所有图片加载成功后，Promise.all就会结束
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset))


function downloadAnim(animationName){
	return new Promise(resolve => {
		const loader = new THREE.FBXLoader()
		loader.setPath('./animations/')
		loader.load(animationName, function(anim) {
			const action = animationName.split('.')[0]
			animationsHub[action] = anim.animations[0]
			resolve()
		})
	})
}

function downloadAsset(assetName){
return new Promise(resolve => {
	useImportModel(`obj/${assetName}`).then((model)=>{
			console.log(`Downloaded ${assetName}`)
			console.log(model[0], model[1])
			if(model[1] === 'gltf'){
				const gltf = model[0]
				console.log(gltf.scene)
				assets[assetName] = gltf.scene

				let animations = {};
	
				gltf.animations.forEach( (anim)=>{
					animations[anim.name] = anim;
				})
		
				animationsClipHub[assetName] = animations
		
				console.log(animationsClipHub)

				assets[assetName].up = new THREE.Vector3(0, 1, 0)
		
				
				// aim.lookAt(new THREE.Vector3(0,1,0))
		
				actionHub[assetName] = assetName === "knight.glb" ? ["Walk", "Dance", "Idle", "Die"] : null
				actionHub[assetName] = assetName === "Soldier.glb" ? ["Walk", "Run", "Idle", "TPose"] : null

				// 调用动画
				// mixerHub[assetName] = new THREE.AnimationMixer( assets[assetName] ); 
				// window.curAction = mixer.clipAction( window.animations[window.actionName] ).setDuration(1).play();
				
				// const axes = new THREE.AxisHelper(10); // 坐标轴不需要
		
				// window.scene.add(axes)
				if(assetName === 'magicRing/scene.gltf'){
					// assets[assetName].position.set(0, -0.2 ,0)
					// assets[assetName].scale.set(0.3, 0.3 ,0.3)
					// const mixer = new THREE.AnimationMixer(assets[assetName]).clipAction(animationsClipHub['magicRing/scene.gltf']['Take 01'])
					// mixer.enabled = true
					// mixer.play()
					// window.scene.add(assets[assetName])
				}else{
					assets[assetName].position.set(0, 0 ,0)
					assets[assetName].scale.set(1, 1 ,1)
				}
		
				// console.log(aim)
				// gltf.animations; // Array<THREE.AnimationClip>
				// gltf.scene; // THREE.Scene
				// gltf.scenes; // Array<THREE.Scene>
				// gltf.cameras; // Array<THREE.Camera>
				// gltf.asset; // Object
			}else if(model[1] === 'fbx'){
				const fbx = model[0]
				fbx.scale.setScalar(0.01);
				fbx.position.set(0, 0, 0);
				fbx.traverse((c) => (c.castShadow = true))
				assets[assetName] = fbx
				console.log(fbx)
			}
	})
	
	resolve();
})
}

export const downloadAnimations = () => downloadAnims

export const downloadAssets = () => downloadPromise

export const getAsset = (id, assetName, username) => {
	if(!window[`assets_${id}`]){
		window[`assets_${id}`] = THREE.SkeletonUtils.clone(assets[assetName]) // 由基础物体克隆出来
		window[`assets_${id}`].up = new THREE.Vector3(0, 1, 0)
		window[`assets_${id}`].position.set(0,0,0)
		mixerHub[`${id}`] = new THREE.AnimationMixer(window[`assets_${id}`])
		const loader = new THREE.FontLoader();
		loader.load('fonts/Microsoft_YaHei_Regular.json', function ( font ) {
			const geometry = new THREE.TextGeometry( username , {
				font: font,
				size: 10,
				height: 1,
				// curveSegments: 12,
				// bevelEnabled: true,
				// bevelThickness: 10,
				// bevelSize: 8,
				// bevelSegments: 5
			} );
			const meshMaterial = new THREE.MeshNormalMaterial({
                flatShading: THREE.FlatShading,
                transparent: true,
                opacity: 0.9
   		    });
			// const meshMaterial = new THREE.MeshLambertMaterial({color: 0x808080});
			const fontModel = new THREE.Mesh(geometry, meshMaterial);
			fontModel.position.set(-20, 0, 80);
			if(assetName === 'knight.glb'){
				fontModel.rotation.y = Math.PI;
			}
			console.log(fontModel.rotation.x,fontModel.rotation.y,fontModel.rotation.z)
			// scene.add(fontModel);
			// const fontModel = new THREE.Mesh(geometry,fontMaterial)
			// fontModel.position.set(10,10,10)

			// 加文字
			window[`assets_${id}`].add(fontModel)

			// 非gltf注释掉下面一行
			// window[`mixer_${id}`].clipAction(getAnimations(assetName)['Scene']).setDuration(20).play()
		})
	}
	return window[`assets_${id}`]
} 

export const getMixer = id => mixerHub[id]
export const getAnimations = assetName => animationsClipHub[assetName]
export const getAction = assetName => actionHub[assetName]