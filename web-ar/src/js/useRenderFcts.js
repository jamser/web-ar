const useRenderFcts = (onRenderFcts, renderer) => {
	let newonRenderFcts = onRenderFcts

	// update artoolkit on every frame
    onRenderFcts.push(function(){
        if( arToolkitSource.ready === false )	return
        arToolkitContext.update( arToolkitSource.domElement )
        // update scene.visible if the marker is seen
        scene.visible = camera.visible
    })

	newonRenderFcts.push(function(delta){
		if(window.mixer){
            // mixer.update(delta)//刷新动画渲染
			window.mixer.update(delta);
        }
	});

	//render the whole thing on the page
	// render the scene
	newonRenderFcts.push(function(){
		renderer.render( scene, camera );
	});


	return newonRenderFcts
}


export default useRenderFcts