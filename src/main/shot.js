/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 15:02:43
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-18 14:41:59
 */
import { BrowserWindow, ipcMain, screen, desktopCapturer, globalShortcut } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// 截图快捷键
let shotWindow = null;
// win 为index创建的主窗口，url为截屏的前端页面路由
function registerShort(win, url) {
  globalShortcut.register('CommandOrControl+Alt+c', () => {
    openShotScreen(win, url)
  })
  
  shotListener(win, url)
}

// win 为index创建的主窗口，url为截屏的前端页面路由
function shotListener(win, url) {
  ipcMain.on('shot_open_screen', (event, bol) => {
    openShotScreen(win, url, bol)
  })
  ipcMain.on('shot_show_screen', async (event) => {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: getSize()
    })

    shotWindow && shotWindow.webContents.send('shot_get_screen', sources[0])
  })
  ipcMain.on('shot_finish_screen', async (event, data) => {
    closeShotWindow()
    win.webContents.send('shot_get_info', data)
    win.show()
  })
  ipcMain.on('shot_close_screen', async (event) => {
    closeShotWindow()
    win.show()
  })
}

function openShotScreen(win, url, bol = true) {
  closeShotWindow()
  if (bol) win.hide()
  createShotWindow(url)
  shotWindow && shotWindow.show()
}

function closeShotWindow() {
  shotWindow && shotWindow.close()
  shotWindow = null
}

function createShotWindow(url = '/shot') {
  const { width, height } = getSize()
  
  shotWindow = new BrowserWindow({
    width,
    height,
    autoHideMenuBar: true,
    useContentSize: true,
    movable: false,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    fullscreenable: true,
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    shotWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${url}`)
    // shotWindow.webContents.openDevTools()  // 开发模式打开控制台
  } else {
    shotWindow.loadFile(join(__dirname, `../renderer/index.html`), { hash: url })
    // shotWindow.webContents.openDevTools()
  }

  shotWindow.maximize()
  shotWindow.setFullScreen(true)
}

function getSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor
  }
}

export {
  registerShort,
  // shotListener
}