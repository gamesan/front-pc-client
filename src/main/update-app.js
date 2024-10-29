/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-14 10:14:24
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-14 14:09:12
 */
import { autoUpdater } from 'electron-updater'

import { ipcMain, remote } from 'electron'
let mainWindow = null

// 配置取消自动下载
autoUpdater.autoDownload = false 
// 关闭退出后自动静默安装程序
autoUpdater.autoInstallOnAppQuit = false

export function updateHandle(window, feedUrl) {
  mainWindow = window;
  //设置更新包的地址
  autoUpdater.setFeedURL(feedUrl);
  //监听升级失败事件
  autoUpdater.on('error', function (error) {
    sendUpdateMessage({
      cmd: 'error',
      message: error
    })
  });
  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (message) {
    sendUpdateMessage({
      cmd: 'checking-for-update',
      message: message
    })
  });
  //监听发现可用更新事件
  autoUpdater.on('update-available', function (message) {
    sendUpdateMessage({
      cmd: 'update-available',
      message: message
    })
  });
  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function (message) {
    sendUpdateMessage({
      cmd: 'update-not-available',
      message: message
    })
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage({
      cmd: 'download-progress',
      message: progressObj
    })
  });
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
    sendUpdateMessage({
      cmd: 'update-downloaded',
      message: {
        releaseNotes,
        releaseName,
        releaseDate,
        updateUrl
      }
    })
  });

  // 立即安装
  ipcMain.on('immediate-install', function() {
    //退出并安装更新包
    global.shareData.canQuit = true
    autoUpdater.quitAndInstall();
  })
  // 立即下载
  ipcMain.on('immediate-download', function() {
    autoUpdater.downloadUpdate();
  })

  //接收渲染进程消息，开始检查更新
  ipcMain.on("checkForUpdate", (e, arg) => {
    //执行自动更新检查
    // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
    autoUpdater.checkForUpdates();
  })
}
//给渲染进程发送消息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('update-message', text)
}