/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-12 16:22:11
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-18 16:39:34
 */
import axios from 'axios'
// 创建一个 axios 实例
const service = axios.create({
  baseURL: '',
  withCredentials: true,
  timeout: 300000 // 请求超时时间(5分钟)
})


// 请求拦截器
service.interceptors.request.use(
  config => {
    // console.log(config, global.shareData.token)
    // 在请求发送之前做一些处理
    // const token = global.shareData.token
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers.Authorization = token
    return config
  },
  error => {
    // 发送失败
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // console.log(response)
    const dataAxios = response.data
    return dataAxios
  },
  error => {
    return Promise.reject(error)
  }
)

export default service