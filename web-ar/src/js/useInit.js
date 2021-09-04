const useInit = () => {
	// 初始化场景和摄像机
    window.scene = new THREE.Scene();
    window.light = new THREE.DirectionalLight(0xffffff,1.0);
    scene.visible = false;

    //位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不同
    light.position.set(1, 1, 1 ).normalize();
	// light.position.set(0,30,40);
    light.castShadow = true; // 启用阴影选项
    scene.add(light);

    //环境光设置
    // const ambilight = new THREE.AmbientLight(0xffffff,0.2);
    // scene.add(ambilight);

    scene.add(new THREE.HemisphereLight( 0x606060, 0x404040 ))

    // 初始化摄像机位置(0，0，0)
    window.camera = new THREE.Camera();
    scene.add(camera);
}

export default useInit