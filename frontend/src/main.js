import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'

// Configuration Axios
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

