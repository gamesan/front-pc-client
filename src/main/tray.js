/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-11 14:38:03
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-14 14:12:38
 */

import { Menu, Tray, remote } from 'electron'
import icon from '../../resources/icon.png?asset'


let appTray = null;   // 引用放外部，防止被当垃圾回收

// 隐藏主窗口，并创建托盘，绑定关闭事件
export function setTray(mainWindow) {
  // 系统托盘右键菜单
  let trayMenuTemplate = [
    {     // 系统托盘图标目录
      label: '退出',
      click: function () {
        mainWindow.destroy()
      }
    }
  ];
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  appTray = new Tray(icon) // 引用放外部，防止被当垃圾回收
  // 设置托盘悬浮提示
  appTray.setToolTip('electron-app');
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu);
  // 设置托盘悬浮提示
  appTray.setToolTip('electron-app');
  // 隐藏主窗口
  mainWindow.on('close', (e) => {
    // 通过全局变量控制安装新包的退出
    if (!global.shareData.canQuit) {
      e.preventDefault();  /*阻止应用退出*/
      mainWindow.hide(); /*隐藏当前窗口*/
    }
  })
  // 单击托盘小图标显示应用
  appTray.on('click', function () {
    // 显示主程序
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    global.shareData.canQuit = false
    mainWindow = null
    appTray = null
  })
};