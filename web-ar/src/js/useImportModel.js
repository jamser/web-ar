import Bus from './bus.js'

const useImportModel = () => {

	const onProgress = ( xhr ) => {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			Bus.$emit('hide', Math.round(percentComplete, 2) + '%')
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	const onError = ( xhr ) => { console.log('error') };

	// three.js 载入模型

	const loader = new THREE.GLTFLoader();

	const dracoLoader = new THREE.DRACOLoader()
	// Optional: Provide a DRACOLoader instance to decode compressed mesh data
	dracoLoader.setDecoderPath( 'libs/draco' );
	loader.setDRACOLoader(dracoLoader);

	loader.load( 'obj/knight.glb', function( gltf ) {
		console.log(gltf.scene)

		window.aim = gltf.scene.children[0]

		let animations = {};

		gltf.animations.forEach( (anim)=>{
			animations[anim.name] = anim;
		})

		window.animations = animations

		console.log(animations)

		aim.position.set(0,0,0)
		// gltf.scene.scale.set(0.01,0.01,0.01)
		// aim.lookAt(new THREE.Vector3(0,1,0))

		window.actionName = "Idle"

		// 调用动画
		window.mixer = new THREE.AnimationMixer( aim ); 
		// window.curAction = mixer.clipAction( window.animations[window.actionName] ).setDuration(1).play();
		
		// const axes = new THREE.AxisHelper(10); // 坐标轴不需要

		// window.scene.add(axes)
		window.scene.add(aim)

		// console.log(aim)
		// gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Scene
		// gltf.scenes; // Array<THREE.Scene>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object

	}, onProgress, onError);
}

export default useImportModel