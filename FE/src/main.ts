import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/modules/router'
import VcRegister from '@/components/commons/vc-register'

// ===================== ELEMENT PLUS =========================
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vi from 'element-plus/dist/locale/vi.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Chart from 'chart.js/auto';

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
VcRegister.register(app)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: vi
})
app.mount('#app')
