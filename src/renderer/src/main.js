/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 15:02:43
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-20 10:05:25
 */
// import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './routers'
import store from './store'
import utils from './utils/utils'

import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(store)
app.config.globalProperties.$utils = utils


app.mount('#app')
