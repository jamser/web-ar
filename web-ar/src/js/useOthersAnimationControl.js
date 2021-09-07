// import { changeAction } from "../utils/util"
import { getAnimations } from "../js/assets"

const useOthersAnimationControl = () => {
	setInterval(()=>{
		// 获取除了自己以外其他人的模型和信息 other
		const ids = window.ids
		if(ids.length !== 0){
			ids.forEach(id => {
				if (window[`last_anim_${id}_name`] && window[`last_anim_${id}_name`] === window[`_${id}`].animation) return
	
				// 拿到新动画
				const clip = getAnimations(window[`_${id}`].modelName)[window[`_${id}`].animation]

				if(clip !== undefined && window[`mixer_${id}`]){
					const action = window[`mixer_${id}`].clipAction( clip )
					if (window[`last_anim_${id}`]) window[`last_anim_${id}`].crossFadeTo(action, 0.2);
				
					action.enabled = true;
					action.play();

					window[`last_anim_${id}_name`] = window[`_${id}`].animation
					window[`last_anim_${id}`] = action
				}
			})
		}
	}, 1000)
}


export default useOthersAnimationControl