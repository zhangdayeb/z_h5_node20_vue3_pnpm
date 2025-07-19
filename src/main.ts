import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './lang'
import Vant, { Lazyload } from 'vant'
import ElementPlus from 'element-plus'

import { isMobile } from '@/utils/tools'

async function bootstrap() {
  const app = createApp(App)
  app.use(router)

  if (isMobile()) {
    // 动态加载 Vant 和 Lazyload
    // const { default: Vant, Lazyload } = await import('vant')
    await import('vant/lib/index.css')
    app.use(Vant)
    app.use(Lazyload)
  } else {
    // 动态加载 Element Plus
    // const { default: ElementPlus } = await import('element-plus')
    await import('element-plus/dist/index.css')
    app.use(ElementPlus)
  }

  app.use(i18n)
  app.use(createPinia())

  app.mount('#app')
}

bootstrap()
