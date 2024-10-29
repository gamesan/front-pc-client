<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-14 10:18:35
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-14 10:25:21
-->
<template>
  <div className="cp-update-app">
    <el-dialog
      title="下载提示"
      v-model="dialogVisible"
      width="30%"
      draggable
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="percentage"
        status="success" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      timeOut: null,
      interval: null,
      dialogVisible: false,
      percentage: 0
    }
  },
  mounted() {
    // 10秒后开始检测新版本
    this.timeOut = window.setTimeout(() => {
      window.electron.ipcRenderer.send('checkForUpdate')
    }, 10000)

    // 间隔24小时检测一次
    this.interval = window.setInterval(() => {
      window.electron.ipcRenderer.send('checkForUpdate')
    }, 86400000)

    // 接收主进程版本更新消息
    window.electron.ipcRenderer.on('update-message', (event, arg) => {
      if ('update-available' == arg.cmd) {
        this.$confirm('检测到新版本，是否立即下载', '提示', {
          confirmButtonText: '立刻下载',
          cancelButtonText: '稍后下载',
          closeOnClickModal: false,
          type: 'warning'
        })
          .then(() => {
            window.electron.ipcRenderer.send('immediate-download')
          })
          .catch(() => {})
      } else if ('download-progress' == arg.cmd) {
        let percent = Math.round(parseFloat(arg.message.percent))
        this.percentage = percent
        this.dialogVisible = true
      } else if ('update-downloaded' == arg.cmd) {
        this.dialogVisible = false
        this.$confirm('下载完成，是否立即安装', '提示', {
          confirmButtonText: '立即安装',
          cancelButtonText: '以后再说',
          closeOnClickModal: false,
          type: 'warning'
        })
          .then(() => {
            window.electron.ipcRenderer.send('immediate-install')
          })
          .catch(() => {})
      } else if ('error' == arg.cmd) {
        if (this.dialogVisible) {
          this.dialogVisible = false
          this.$message.error('下载出错，请稍后再试')
        }
      }
    })
  },
  unmounted() {
    window.clearInterval(this.interval)
    window.clearInterval(this.timeOut)
  }
}
</script>

<style lang="less">
.cp-update-app {
  .el-dialog__body {
    padding-top: 15px;
  }
}
</style>