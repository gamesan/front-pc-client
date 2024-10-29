/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 15:02:43
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-13 09:31:19
 */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const electronApis = {
  // 定义 方法, 该方法可以在渲染进程使用
  getFileRender: (fileUrl) => {
    return ipcRenderer.invoke('getFileMain', fileUrl)
  },
  // ajax请求封装
  ajaxRender: (options) => {
    return ipcRenderer.invoke('ajaxMain', options)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronApis', electronApis)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.electronApis = electronApis
}
