const useArMakerControls = () => {
	// 追踪器
    // init controls for camera
    // camera可以替换为THREE.GROUP创建不同东西
    let markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
        type : 'pattern',
        patternUrl : 'arcode/pattern-icon.patt',  // 二维码
        // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
        changeMatrixMode: 'cameraTransformMatrix'
    })
}

export default useArMakerControls