import { createApp } from 'vue'
import App from './App.vue'
import { connect } from './js/networking'


const app = createApp(App)

Promise.all([
	connect()
]).then(() => {

}).catch(console.error)

app.mount('#app')
