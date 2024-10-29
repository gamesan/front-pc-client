/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-11 14:50:09
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-14 15:12:33
 */
import { ipcMain, BrowserWindow } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from './http/axios'

const newWins = {}

export function registerEvent(win) {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  
  // 监听创建一个新的子窗口
  // url: 打开页面的 hash 路由
  // id: 新窗口的唯一标识
  ipcMain.on('create-window', (event, url, id) => {
    // console.log(id, newWins[id])
    if (!id) {
      return
    }
    if (newWins[id]) {
      newWins[id].show()
      newWins[id].focus()
    } else {
      newWins[id] = new BrowserWindow({
        width: 900,
        height: 670,
        show: true,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false,
          nodeIntegration: true, // 渲染进程使用Node API    设置之后  __dirname 可以使用
          contextIsolation: false, // 是否开启隔离上下文     设置之后  __dirname 可以使用

          webSecurity: true, // 默认为 true ，启动同源策略; false 为关闭同源策略
        }
      })
  
      // 关闭窗口菜单
      newWins[id].setMenu(null)
      
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        newWins[id].loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${url}`)
        // newWins[id].webContents.openDevTools()  // 开发模式打开控制台
      } else {
        newWins[id].loadFile(join(__dirname, `../renderer/index.html`), { hash: url })
        // newWins[id].webContents.openDevTools()
      }
  
      newWins[id].on('closed', () => {
        newWins[id] = null
      })
    }
  })

  // 打开控制台
  ipcMain.on('open-devtools', (event) => {
    win.webContents.openDevTools();
  })

  // 读文件
  ipcMain.handle('fs-read', (event, fileUrl) => {
    // fs.readFile(fileUrl, (err, data) => {
    //   // data 是 buffer 数据
    //   // console.log(data)
    //   console.log(data.toString())
    //   if (err) {
    //     console.log(err)
    //     return err
    //   }
    //   return data.toString()
    // })
    try {
      const res = fs.readFileSync(fileUrl, 'utf8')
      return { msg: '成功', data: res }
    } catch(err) {
      return { msg: '失败', data: null }
    }
  })
  ipcMain.handle('getFileMain', (event, fileUrl) => {
    try {
      const res = fs.readFileSync(fileUrl, 'utf8')
      return { msg: '成功', data: res }
    } catch(err) {
      return { msg: '失败', data: null }
    }
  })
  
  // 写文件
  ipcMain.handle('fs-write', (event, fileUrl, data) => {
    try {
      const res = fs.writeFileSync(fileUrl, JSON.stringify(data))
      return { msg: '成功', data: res }
    } catch(err) {
      return { msg: '失败', data: null }
    }
    // fs.writeFile(fileUrl, JSON.stringify(data), (err) => {
    //   console.log(err)
    //   if (err) {
    //     console.log(err)
    //     callback && callback(err)
    //     return
    //   }
    //   console.log('写入成功')
    //   callback && callback({msg: '写入成功'})
    // })
  })

  // 接口请求
  ipcMain.handle('ajaxMain', async (event, options) => {
    try {
      options = JSON.parse(options)
      const config = {
        url: options.url,
        method: options.method || 'get',
      }
      if (config.method.toLocaleLowerCase === 'get') {
        config.params = options.params
      } else {
        config.data = options.params
      }
      const res = await axios(config)
      return { type: 'success', data: res }
    } catch(err) {
      return { type: 'fail', data: null }
    }
  })
}