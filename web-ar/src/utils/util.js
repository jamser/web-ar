import { getAnimations } from "../js/assets";

export function $(elem){
	return document.querySelector(elem)
}

export function changeAction(mylastAnimation, name){
	if(mylastAnimation === name) return
	
	
	const clip = getAnimations(window.me.modelName)[name]

	if(clip !== undefined && window[`mixer_${window.me.id}`]){
		const action = window[`mixer_${window.me.id}`].clipAction( clip )
		if (window[`curAction_${window.me.id}`]) window[`curAction_${window.me.id}`].crossFadeTo(action, 0.5);
	
		action.enabled = true;
		action.play();

		window[`curAction_${window.me.id}`] = action
	}
}