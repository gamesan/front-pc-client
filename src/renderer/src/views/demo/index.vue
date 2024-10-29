<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-25 14:12:31
-->
<template>
  <el-button type="primary" @click="goBack">back</el-button>
  <span class="red">red</span>
  <hr />
  <el-button type="primary" @click="goDemoPage('/demo/old')">初始化项目保留的页面</el-button>
  <el-button type="primary" @click="goDemoPage('/demo/http-vuex-file')"
    >http接口请求、vuex使用、读写文件、各种工具封装调试</el-button
  >
  <el-button type="primary" @click="goDemoPage('/demo/db')">操作本地数据库</el-button>
  <el-button type="primary" @click="goDemoPage('/demo/shot')">截屏</el-button>
  <el-button type="primary" @click="goDemoPage('/demo/xlsx')">上传excel，下载数据导出excel</el-button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}
const goDemoPage = (path) => {
  router.push({
    path: path
  })
}
</script>

<style lang="less" scoped>
.red {
  color: @color_red;
}
.el-button{
  margin-bottom: 16px;
}
</style>
