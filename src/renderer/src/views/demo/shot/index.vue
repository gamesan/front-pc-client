<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-19 10:18:42
-->
<template>
  <el-button type="primary" @click="goBack">back</el-button>
  <hr />
  <div>
    <el-button type="primary" @click="shotScreen(true)">截屏不显示当前页面</el-button>
    <el-button type="primary" @click="shotScreen(false)">截屏显示当前页面</el-button>
    <el-button type="primary" id="refWidth" @click="showWidth">显示宽度</el-button>
    <img :src="imgData" width="100%" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const { ipcRenderer } = window.electron
const imgData = ref('')

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const showWidth = () => {
  const refWidth = document.getElementById('refWidth')
  console.log(refWidth.offsetWidth)
}

const shotScreen = async (bol) => {
  await ipcRenderer.send('shot_open_screen', bol)
}

function getImgInfo(event, data) {
  // console.log(data)
  imgData.value = data
}

onMounted(() => {
  ipcRenderer.on('shot_get_info', getImgInfo)
})

onUnmounted(() => {
  ipcRenderer.removeListener('shot_get_info', getImgInfo)
})
</script>

<style lang="less" scoped>
</style>
