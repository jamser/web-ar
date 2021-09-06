import Bus from './bus.js'

const useImportModel = (modelName) => {
	return new Promise(resolve => {
		const onProgress = ( xhr ) => {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				Bus.$emit('number', Math.round(percentComplete, 2) + '%')
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
		console.log(modelName)
		loader.load(modelName, function( gltf ) {

			resolve(gltf)

		}, onProgress, onError);
	})
}

export default useImportModel