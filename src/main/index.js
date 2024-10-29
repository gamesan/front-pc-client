/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 15:02:43
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-19 15:35:20
 */
import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { setTray } from './tray'
import { registerEvent } from './main-event'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { updateHandle } from './update-app'
import { registerShort } from './shot'

let mainWindow = null

global.shareData = {
  canQuit: false,
  token: ''
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
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

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])

    mainWindow.webContents.openDevTools()  // 开发模式打开控制台
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 关闭窗口菜单
  mainWindow.setMenu(null)

  // 默认启动时窗口最大化 start
  // mainWindow.hide()
  // mainWindow.maximize()
  // 默认启动时窗口最大化 end
  
  // 系统托盘相关
  if (process.platform !== 'darwin') {
    setTray(mainWindow)
  }

  // 版本更新
  // 设置版本更新地址，即将打包后的 latest.yml、.exe、.exe.blockmap文件同时放在
  // http://electron.com 对应的服务器目录下,该地址和 vue.config.js 的 publish 中的 url 保持一致
  let feedUrl = 'http://127.0.0.1:8111/electron_down/';
  //检测版本更新
  updateHandle(mainWindow, feedUrl);
  
  // 主进程注册事件
  registerEvent(mainWindow)

  // 截屏
  registerShort(mainWindow, '/demo/shot-container')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   // Set app user model id for windows
//   electronApp.setAppUserModelId('com.electron')

//   // Default open or close DevTools by F12 in development
//   // and ignore CommandOrControl + R in production.
//   // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
//   app.on('browser-window-created', (_, window) => {
//     optimizer.watchWindowShortcuts(window)
//   })

//   createWindow()

//   // 主进程注册事件
//   registerEvent(mainWindow)

//   app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


// 只打开一个图标
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')
  
    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  
    createWindow()
  
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

