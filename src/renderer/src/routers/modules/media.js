/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:32:38
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-09 17:09:34
 */
const route = [
  {
    path: '/media/video',
    name: 'MediaVideo',
    meta: {
      title: '视频'
    },
    component: () => import('../../views/media/video.vue')
  },
  {
    path: '/media/audio',
    name: 'MediaAudio',
    meta: {
      title: '音频'
    },
    component: () => import('../../views/media/audio.vue')
  }
]

export default route;