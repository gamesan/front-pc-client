<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-11 15:41:45
-->
<template>
  <el-button type="primary" @click="goBack">back</el-button>
  <hr>
  <img alt="logo" class="logo" src="../../assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
  <versions />
</template>

<script setup>
import versions from '../../components/demo/versions.vue'
import { useRouter } from 'vue-router'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.logo {
  margin-bottom: 20px;
  -webkit-user-drag: none;
  height: 128px;
  width: 128px;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 1.2em #6988e6aa);
}

.creator {
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.text {
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
  margin: 0 10px;
  padding: 16px 0;
}

.tip {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}

.vue {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.actions {
  display: flex;
  padding-top: 32px;
  margin: -6px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.action {
  flex-shrink: 0;
  padding: 6px;
}

.action a {
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
}

.versions {
  position: absolute;
  bottom: 30px;
  margin: 0 auto;
  padding: 15px 0;
  font-family: 'Menlo', 'Lucida Console', monospace;
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  border-radius: 22px;
  background-color: #202127;
  backdrop-filter: blur(24px);
}

.versions li {
  display: block;
  float: left;
  padding: 0 20px;
  font-size: 14px;
  line-height: 14px;
  opacity: 0.8;
}
</style>
