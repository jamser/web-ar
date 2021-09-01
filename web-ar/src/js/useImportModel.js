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
	loader.load( 'obj/scene.gltf', function( gltf ) {
	  window.scene.add(gltf.scene)
		// materials.preload();
		// var objLoader = new THREE.OBJLoader();
		// objLoader.setMaterials( materials );
		// objLoader.setPath( 'obj/' );
		// objLoader.load( 'jj.obj', function ( object ) {
		//     scene.add( object );
		//     object.position.set(0,0,0);
		//     object.scale.set(0.0001,0.0001,0.0001);
		//     // var axes = new THREE.AxisHelper(10); // 坐标轴不需要
		//     // scene.add(axes);
		// }
	}, onProgress, onError);
}

export default useImportModel