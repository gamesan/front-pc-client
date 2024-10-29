<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-25 17:15:53
-->
<template>
  <el-button type="primary" @click="goBack">back</el-button>
  <hr />
  <el-upload
    ref="upload"
    action="#"
    :before-upload="beforeUpload"
    :http-request="httpRequest"
    :limit="1"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
  </el-upload>
  <el-button type="primary" @click="down">下载导出EXCEL</el-button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx' // 注意，需要用 * as 转换一下。否则报错
import { ElMessage } from 'element-plus'

onMounted(() => {})

const upload = ref()

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

let downDate = []
function beforeUpload(file) {
  // console.log(upload.value, file)

  readExcel(file).then((res) => {
    console.log(JSON.stringify(res))
    const json = {
      name: '姓名',
      age: '年龄',
      sex: '性别',
      degree: '学历'
    }
    downDate = []
    const data = []
    for (let i = 0; i < res.length; i++) {
      const item = res[i]
      const item2 = {}
      for (let key in json) {
        item2[key] = item[json[key]] + ''
      }
      data.push(item2)
      downDate.push(item)
    }
    // console.log(data)
    const request = indexedDB.open('testDatabase')
    request.onsuccess = function (event) {
      const db = event.target.result

      // 创建一个读写事物
      const transaction = db.transaction('person', 'readwrite')

      // 获取对象存储
      const objectStore = transaction.objectStore('person')

      // 遍历数据并批量添加数据
      data.forEach((item, index) => {
        const request = objectStore.add(item)
        request.onsuccess = function () {
          console.log(`第${index + 1}条数据添加成功`)
        }
        request.onerror = function () {
          console.log(`第${index + 1}条数据添加失败`)
        }
      })

      ElMessage({
        type: 'success',
        message: '上传成功'
      })
    }
    request.onerror = function () {
      console.log('打开数据库失败')
    }
  })
}

function httpRequest() {}

function readExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const firstSheetName = workbook.SheetNames
      const worksheet = workbook.Sheets[firstSheetName[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      // console.log(firstSheetName, worksheet, jsonData)
      resolve(jsonData)
    }

    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function down() {
  if (!downDate.length) {
    ElMessage({
      type: 'error',
      message: '没有导出的数据，请先上传数据'
    })
    return
  }
  exportToExcel(downDate, 'test.xlsx')
}

function exportToExcel(data, fileName) {
  // data 的格式 [{"姓名":"张三","年龄":24,"性别":1,"学历":2},{"姓名":"李四","年龄":32,"性别":2,"学历":3}]
  // 创建一个新工作簿
  const workbook = XLSX.utils.book_new()

  // 将数据转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(data)

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet2')

  // 写入Excel文件
  XLSX.writeFile(workbook, fileName)

  // ElMessage({
  //   type: 'success',
  //   message: '下载成功'
  // })
}
</script>

<style lang="less" scoped>
</style>
