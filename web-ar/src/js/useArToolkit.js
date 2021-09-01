const useArToolkit = (renderer) => {
	// handle arToolkitSource
    window.arToolkitSource = new THREEx.ArToolkitSource({})
    arToolkitSource.init(function onReady(){
        onResize()
    })

    // handle resize
    window.addEventListener('resize', function(){
        onResize()
    })

    function onResize(){
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if( arToolkitContext.arController !== null ){
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    }

    // create atToolkitContext
    window.arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl:  '../data/camera_para.dat',
        detectionMode: 'mono',
    })

    // initialize it
    arToolkitContext.init(function onCompleted(){
        // copy projection matrix to camera
        camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
    })
}

export default useArToolkit