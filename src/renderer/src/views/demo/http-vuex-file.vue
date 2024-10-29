<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-18 17:20:07
-->
<template>
  <div class="demo-home">
    <el-button type="primary" @click="goHomePage">back</el-button>
    <hr>
    <el-button type="primary" @click="getWeatherData">获取天气信息</el-button>
    <el-button type="primary" @click="getIp">查询ip信息</el-button>
    <el-button type="primary" @click="setUuid">生成uuid</el-button>
    <p class="text">天气信息：{{ weather }}</p>
    <p class="text">ip信息：{{ ipInfo }}</p>
    <p class="text">uuid：{{ uuid }}</p>
    <el-input v-model="time" type="number" class="input"></el-input>
    <el-button type="primary" @click="setTime">设置time值</el-button>
    <p class="text">{{ $store.state.time }}</p>
    <el-input v-model="name" placeholder="name" class="input"></el-input>
    <el-input
      v-model="age"
      placeholder="age"
      type="number"
      class="input"
    ></el-input>
    <el-button type="primary" @click="setData">设置data值</el-button>
    <p class="text">{{ $store.state.data }}</p>
    <el-button type="primary" @click="getFileData">读取文件</el-button>
    <p class="text">读取文件信息:{{ fileData }}</p>
    <el-button type="primary" @click="writeFileData">写入文件</el-button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const { proxy } = getCurrentInstance()

let weather = ref('')
let ipInfo = ref('')
let uuid = ref('')
let time = ref('')
let name = ref('')
let age = ref(0)
let fileData = ref('')

onMounted(() => {})

const writeFileData = async () => {
  const data = {
    name: name.value,
    age: Number(age.value)
  }
  const res = await window.electron.ipcRenderer.invoke('fs-write', 'D:/db/data/1.json', data)
  console.log(res)
  // fs.writeFile('D:/db/data/1.json', JSON.stringify(data), (err) => {
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   console.log('写入成功')
  // })
}

const getFileData = async () => {
  // ipcRenderer 中不能传对象
  // window.electron.ipcRenderer.send('fs-read', 'D:/db/data/1.json', (data) => {
  //   console.log(data, typeof data)
  //   this.fileData = data
  // })
  
  // let data = await window.electron.ipcRenderer.invoke('fs-read', 'D:/db/data/1.json')
  // console.log(data)
  
  let data = await window.electronApis.getFileRender('D:/db/data/1.json')
  // console.log(data)
  fileData.value = data
}

const setData = () => {
  store.commit("setData", {
    name: name.value,
    age: Number(age.value),
  });
}

const setTime = () => {
  store.commit("setTime", Number(time.value));
}

const goHomePage = () => {
  router.go(-1)
}

const getWeatherData = async () => {
  const options = {
    url: 'http://www.weather.com.cn/data/sk/101010100.html',
    method: 'get'
  }
  const res = await proxy.$utils.comAjax(options, true)
  console.log(res)
  if (res.type === 'success') {
    weather.value = res.data;
  }
}

const getIp = async () => {
  // 接口介绍 https://www.cnblogs.com/huchong/p/9299875.html
  const options = {
    url: 'http://ip-api.com/json/?lang=zh-CN',
    method: 'get'
  }
  const res = await proxy.$utils.comAjax(options)
  console.log(res)
  if (res.type === 'success') {
    ipInfo.value = res.data;
  }
}

const setUuid = () => {
  uuid.value = proxy.$utils.guid();
}
</script>

<style lang="less" scoped>
.demo-home {
  .input {
    width: 150px;
    margin-right: 20px;
  }
  .text {
    padding-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
