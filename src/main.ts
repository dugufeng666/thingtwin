import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueKonva from 'vue-konva'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VueKonva)

// Mount app
app.mount('#app') 