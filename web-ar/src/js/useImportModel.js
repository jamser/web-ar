const useImportModel = () => {

	const onProgress = ( xhr ) => {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	const onError = ( xhr ) => { console.log('error') };

	// three.js 载入模型

	const loader = new THREE.GLTFLoader();

	// Optional: Provide a DRACOLoader instance to decode compressed mesh data
	THREE.DRACOLoader.setDecoderPath( 'libs/draco' );
	loader.setDRACOLoader( new THREE.DRACOLoader() );

	// Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
	THREE.DRACOLoader.getDecoderModule();

	loader.load( 'obj/scene.gltf', function( gltf ) {
	  	window.scene.add(gltf.scene)

		// gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Scene
		// gltf.scenes; // Array<THREE.Scene>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object

	}, onProgress, onError);
}

export default useImportModel