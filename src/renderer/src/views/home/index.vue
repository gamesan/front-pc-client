<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-14 14:55:34
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-17 10:02:21
-->
<template>
  <div>
    <el-button type="primary" @click="goDemoPage('/demo/index')">demo入口页面</el-button>
    <el-button type="primary" @click="goDemoPage('/trend/index')">趋势</el-button>
    <el-button type="primary" @click="goChildPage('/media/video', 'video_1')">视频栏</el-button>
    <el-button type="primary" @click="goChildPage('/media/audio', 'audio_1')">音频栏</el-button>
    <el-button type="primary" @click="openDevTools">打开控制台</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  components: {
    
  },
  created() {
    localStorage.setItem('demo', 1)
  },
  methods: {
    goChildPage(url, id) {
      window.electron.ipcRenderer.send('create-window', url, id)
    },
    openDevTools() {
      window.electron.ipcRenderer.send('open-devtools')
    },
    goDemoPage(path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style>

</style>
