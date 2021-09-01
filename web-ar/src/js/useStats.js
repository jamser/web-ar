import { onMounted  } from 'vue'

const useStats = () => {

	const state = {
		stats: {}
	}

	state.stats = new Stats()

	//fps状态
	const initStats = () => {
	  
	  state.stats.setMode(0) // 0: fps, 1: ms

	  // Align top-left
	  state.stats.domElement.style.position = 'absolute';
	  state.stats.domElement.style.left = '0px';
	  state.stats.domElement.style.top = '0px';

	  document.getElementById("Stats-output").appendChild(state.stats.domElement);
	}

	onMounted(()=>{
		initStats()
	})

	return state
}

export default useStats

