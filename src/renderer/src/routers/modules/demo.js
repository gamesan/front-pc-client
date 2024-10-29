/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:32:38
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-25 10:03:18
 */
const route = [
  {
    path: '/demo/index',
    name: 'DemoIndex',
    meta: {
      title: '例子'
    },
    component: () => import('../../views/demo/index.vue')
  },
  {
    path: '/demo/old',
    name: 'DemoOld',
    meta: {
      title: '例子'
    },
    component: () => import('../../views/demo/old.vue')
  },
  {
    path: '/demo/http-vuex-file',
    name: 'DemoHttpVuexFile',
    meta: {
      title: '例子'
    },
    component: () => import('../../views/demo/http-vuex-file.vue')
  },
  {
    path: '/demo/db',
    name: 'DemoDB',
    meta: {
      title: '操作本地数据库'
    },
    component: () => import('../../views/demo/db.vue')
  },
  {
    path: '/demo/shot',
    name: 'DemoShot',
    meta: {
      title: '截图'
    },
    component: () => import('../../views/demo/shot/index.vue')
  },
  {
    path: '/demo/shot-container',
    name: 'DemoShotContainer',
    meta: {
      title: '截图'
    },
    component: () => import('../../views/demo/shot/shot.vue')
  },
  {
    path: '/demo/xlsx',
    name: 'DemoXlsx',
    meta: {
      title: '文档操作'
    },
    component: () => import('../../views/demo/xlsx.vue')
  }
]

export default route;