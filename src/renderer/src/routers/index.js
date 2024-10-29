/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:31:33
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-13 16:36:06
 */
import { createRouter,createWebHashHistory, createWebHistory } from "vue-router";
import demo from './modules/demo'

import trend from './modules/trend'
import home from './modules/home'
import media from './modules/media'

const routes = [
  ...home,
  ...trend,
  ...demo,
  ...media,
  {
    path: '/',
    redirect: '/home/index'
  },
]

const hashRoute = true
const router = createRouter({
  history: hashRoute ? createWebHashHistory() : createWebHistory(),
  routes: routes
})

// 路由守卫设置
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  document.title = to.meta.title || 'home'
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0);
});


// router.afterEach((to, from) => {
//   window.scrollTo(0, 0);
// });

export default router;