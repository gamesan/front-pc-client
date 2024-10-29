const route = [
  {
    path: '/home/index',
    name: 'HomeIndex',
    meta: {
      title: '首页'
    },
    component: () => import('../../views/home/index.vue')
  }
]

export default route;