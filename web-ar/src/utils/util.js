import { getAnimations } from "../js/assets";

export function $(elem){
	return document.querySelector(elem)
}

export function changeAction(info, mylastAnimation = null, name){
	if(mylastAnimation === name) return
	
	const id = info.id
	const clip = getAnimations(info.modelName)[name]

	if(clip !== undefined && window[`mixer_${id}`]){
		const action = window[`mixer_${id}`].clipAction( clip )
		if (window[`curAction_${id}`]) window[`curAction_${id}`].crossFadeTo(action, 0.1);
	
		action.enabled = true;
		action.play();

		window[`curAction_${id}`] = action
	}
}