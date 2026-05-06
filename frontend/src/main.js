import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'

// Configuration Axios
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.withCredentials = true

// Fetch CSRF cookie on app load for Sanctum SPA authentication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.get(`${API_URL}/sanctum/csrf-cookie`).catch(() => {
  // Silently ignore if backend is unreachable (login page will handle it)
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

