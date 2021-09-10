import { createApp } from 'vue'
import App from './App.vue'
import { connect } from './js/networking'
import Bus from './js/bus.js'
import { downloadAssets, downloadAnimations } from './js/assets';
import Vant from 'vant';
import 'vant/lib/index.css';




Promise.all([
	connect(),
	downloadAnimations(),
	downloadAssets()
]).then(() => {
	const app = createApp(App)
	app.use(Vant)
	app.mount('#app')
	Bus.$emit('hide')
}).catch(console.error)


