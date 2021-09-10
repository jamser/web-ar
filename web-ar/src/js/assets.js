import useImportModel from './useImportModel.js'
import { ASSET_NAMES, ANIMATIONS } from '../common/common.js'


const assets = {};
const mixerHub = {};
const animationsHub = {};
const animationsClipHub = {};
const actionHub = {};


const downloadAnims = Promise.all(ANIMATIONS.map(downloadAnim)).then(()=>{
	console.log(animationsHub)
	ASSET_NAMES.map(item => {
		animationsClipHub[item] = animationsHub
	})
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
				assets[assetName] = gltf.scene.children[0];

				let animations = {};
	
				gltf.animations.forEach( (anim)=>{
					animations[anim.name] = anim;
				})
		
				animationsClipHub[assetName] = animations
		
				console.log(animationsClipHub)

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
				size: 20,
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
			fontModel.position.set(0, 30, 80);
			if(assetName === 'knight.glb'){
				fontModel.rotation.y = Math.PI;
			}
			console.log(fontModel.rotation.x,fontModel.rotation.y,fontModel.rotation.z)
			// scene.add(fontModel);
			// const fontModel = new THREE.Mesh(geometry,fontMaterial)
			// fontModel.position.set(10,10,10)
			window[`assets_${id}`].add(fontModel)
		})
	}
	return window[`assets_${id}`]
} 

export const getMixer = id => mixerHub[id]
export const getAnimations = assetName => animationsClipHub[assetName]
export const getAction = assetName => actionHub[assetName]