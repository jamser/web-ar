import { onMounted, reactive, toRefs } from 'vue'

const useRenderer = () => {
	const state = {
		renderer: {}
	}

	state.renderer = new THREE.WebGLRenderer({
		antialias: true,                                	//开启抗锯齿
		alpha: true                                      	//开启背景透明
	});

	const initRenderer = () => {
		// init renderer
		state.renderer.setClearColor(new THREE.Color('lightgrey'), 0);
		state.renderer.setPixelRatio( window.devicePixelRatio );
		state.renderer.setSize( window.innerWidth, window.innerHeight );
		state.renderer.outputEncoding = THREE.sRGBEncoding;
		state.renderer.domElement.style.position = 'absolute';
		state.renderer.domElement.style.top = '0px';
		state.renderer.domElement.style.left = '0px';
		document.body.appendChild(state.renderer.domElement);
	}
	
	onMounted(()=>{
		initRenderer()
	})

	return state
}

export default useRenderer