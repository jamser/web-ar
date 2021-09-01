const useAnimationFrame = (onRenderFcts, stats) => {
	// run the rendering loop
    let lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        stats.update();
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec-1000/60
        let deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec = nowMsec
        // call each update function
        onRenderFcts.forEach(
            function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })
}

export default useAnimationFrame