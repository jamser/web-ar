export function $(elem){
	return document.querySelector(elem)
}

export function changeAction(name){
	if (window.actionName == name) return;
	
	const clip = window.animations[name];
	
	if (clip!==undefined){
		const action = window.mixer.clipAction( clip );
		
		if (name=='Die'){
			action.loop = THREE.LoopOnce;
			action.clampWhenFinished = true;
		}
		
		window.actionName = name;
		if (window.curAction) window.curAction.crossFadeTo(action, 0.5);
		action.enabled = true;
		action.play();
		
		window.curAction = action;
	}
}