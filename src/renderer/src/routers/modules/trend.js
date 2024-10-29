/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:32:38
 * @LastEditors: yanghua
 * @LastEditTime: 2024-10-09 16:51:25
 */
const route = [
  {
    path: '/trend/index',
    name: 'TrendIndex',
    meta: {
      title: '趋势'
    },
    component: () => import('../../views/trend/index.vue')
  },
]

export default route;