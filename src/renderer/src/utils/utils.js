/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-14 14:55:34
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-19 10:08:12
 */
import { ElLoading } from 'element-plus'

let loading = null

export default {
  /**
   * 介绍：封装ajax请求
   * @param {object} options 
   * options.url: 接口 url
   * options.method: 接口方法 默认 get 
   * options.params：请求参数
   * @param {boolean} load 
   * load: 是否请求时加loading 默认不加 false
   * @returns promise
   */
  async comAjax(options = {}, load = false) {
    if (load) {
      loading = ElLoading.service({
        lock: true,
        text: 'loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
    }
    const res = await window.electronApis.ajaxRender(JSON.stringify(options))
    if (load) {
      loading.close()
      loading = null
    }
    return new Promise((resolve) => {
      resolve(res)
    })
  },

  /**
   * 介绍：生成uid
   * @returns 
   */
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * 
   * @param {Array} arr 
   * 比较数组版本号例如 ['1.0.0', '1.0.2']
   * @param {string} order 
   * 排序规则 up 升序、 down 降序。默认升序
   * @returns 
   */
  sortVersion(arr = [], order = 'up') {
    if (!Array.isArray(arr)) {
      return []
    }
    const num = order === 'up' ? 1 : -1
    arr.sort((a, b) => {
      const a_arr = a.split('.')
      const b_arr = b.split('.')
      // console.log(a, b, a_arr, b_arr)
      if (a_arr[0] === b_arr[0]) {
        if (a_arr[1] === b_arr[1]) {
          return (a_arr[2] - b_arr[2]) * num
        } else {
          return (a_arr[1] - b_arr[1]) * num
        }
      } else {
        return (a_arr[0] - b_arr[0]) * num
      }
    })
    return arr
  }
}