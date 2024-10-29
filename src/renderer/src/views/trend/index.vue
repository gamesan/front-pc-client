<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-10-10 14:05:56
-->
<template>
  <div class="trend-index">
    <el-button type="primary" @click="goHomePage">back</el-button>
    <hr />
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="searchForm.age" type="number" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSelect">查询数据</el-button>
      </el-form-item>
    </el-form>
    <hr />
    <el-button type="primary" @click="addEvent(addRuleForm)">新增</el-button>
    <hr />
    <el-table :data="tableData.list">
      <el-table-column label="序号" type="index" :index="setIndex" width="60"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="sex">
        <template #default="scope">{{ scope.row.sex === '1' ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column label="学历" prop="degree">
        <template #default="scope">{{ setDegree(scope.row.degree) }}</template>
      </el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" @click="modifyEvent(scope)">修改</el-button>
          <el-button size="small" type="danger" @click="deleteEvent(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="tableData.currentPage"
      :page-size="tableData.pageSize"
      :page-sizes="tableData.pageSizes"
      :total="tableData.total"
      layout="prev, pager, next, sizes, total, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
  <!-- 新增 -->
  <el-dialog v-model="addVisible" width="400px" @closed="addDialogClose" title="新增数据">
    <el-form :rules="rules" ref="addRuleForm" :model="addForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="addForm.sex">
          <el-radio value="1">男</el-radio>
          <el-radio value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学历" prop="degree">
        <el-select v-model="addForm.degree">
          <el-option label="初中" value="1"></el-option>
          <el-option label="高中" value="2"></el-option>
          <el-option label="大学" value="3"></el-option>
          <el-option label="大学以上" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="addForm.age" type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addCancel(addRuleForm)">取消</el-button>
      <el-button type="primary" @click="addSure(addRuleForm)">添加数据</el-button>
    </template>
  </el-dialog>
  <!-- 修改 -->
  <el-dialog v-model="updateVisible" width="400px" title="修改数据">
    <el-form :rules="rules" ref="updateRuleForm" :model="updateForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="updateForm.name" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="updateForm.sex">
          <el-radio value="1">男</el-radio>
          <el-radio value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学历" prop="degree">
        <el-select v-model="updateForm.degree">
          <el-option label="初中" value="1"></el-option>
          <el-option label="高中" value="2"></el-option>
          <el-option label="大学" value="3"></el-option>
          <el-option label="大学以上" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="updateForm.age" type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateCancel(updateRuleForm)">取消</el-button>
      <el-button type="primary" @click="updateSure(updateRuleForm)">更新数据</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ClientIndexeddb from '../../utils/client-indexeddb'

let addVisible = ref(false)
let updateVisible = ref(false)
const addRuleForm = ref()
const updateRuleForm = ref()
const searchForm = reactive({
  name: '',
  age: ''
})
const addForm = reactive({
  name: '',
  age: '',
  degree: '1',
  sex: '1'
})
const updateForm = reactive({
  id: 0,
  name: '',
  age: '',
  degree: '',
  sex: ''
})
const tableData = reactive({
  list: [],
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50],
  total: 2
})
const rules = reactive({
  name: [{ required: true, message: '该项不能为空', target: 'blur' }],
  age: [{ required: true, message: '该项不能为空', target: 'blur' }]
})

const router = useRouter()
const { proxy } = getCurrentInstance()

const clientIndexeddb = new ClientIndexeddb('trendDatabase', 'trend', ['name', 'age'], () => {
  onSelect()
})

onMounted(() => {
  clientIndexeddb.initDb()
})

onUnmounted(() => {})

function setDegree(degree) {
  const json = {
    1: '初中',
    2: '高中',
    3: '大学',
    4: '大学以上'
  }
  return json[degree]
}

function setIndex(index) {
  return index + 1 + (tableData.currentPage - 1) * tableData.pageSize
}

function addDialogClose() {
  addForm.name = ''
  addForm.age = ''
  addForm.sex = '1'
  addForm.degree = '1'
}

function addEvent(formEL) {
  addVisible.value = true
  formEL && formEL.clearValidate()
}

function modifyEvent(scope) {
  // console.log(scope)
  const id = scope.row.id
  clientIndexeddb.getData(id).then((res) => {
    // console.log(res)
    updateVisible.value = true
    // updateForm.id = id
    // updateForm.name = res.data.name
    // updateForm.age = res.data.age
    // updateForm.degree = res.data.degree
    // updateForm.sex = res.data.sex
    Object.assign(updateForm, res.data, {id: id})
  })
}

function deleteEvent(scope) {
  // console.log(scope)
  ElMessageBox.confirm('确认删除该条数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      clientIndexeddb.deleteData(scope.row.id).then((res) => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        onSelect()
      })
    })
    .catch(() => {})
}

function sizeChange(num) {
  // console.log(num)
  tableData.currentPage = 1
  tableData.pageSize = num
  onSelect()
}

function currentChange(num) {
  // console.log(num)
  tableData.currentPage = num
  onSelect()
}

function onSelect() {
  clientIndexeddb
    .selectData(
      {
        name: searchForm.name,
        age: searchForm.age
      },
      tableData.currentPage,
      tableData.pageSize
    )
    .then((res) => {
      // console.log(res)
      tableData.list = res.data.list
      tableData.total = res.data.total
    })
}

function addCancel(formEL) {
  addVisible.value = false
  formEL.clearValidate()
}

async function addSure(formEL) {
  await formEL.validate((valid, fields) => {
    console.log(valid, fields)
    if (!valid) return
    clientIndexeddb.addData(addForm).then((res) => {
      ElMessage({
        type: 'success',
        message: '新增成功'
      })
      addVisible.value = false
      onSelect()
    })
  })
}

function updateCancel(formEL) {
  updateVisible.value = false
  formEL.clearValidate()
}

async function updateSure(formEl) {
  await formEl.validate((valid, fields) => {
    console.log(valid, fields)
    if (!valid) return
    clientIndexeddb.putData(updateForm).then((res) => {
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      updateVisible.value = false
      onSelect()
    })
  })
}

function goHomePage() {
  router.go(-1)
}
</script>

<style lang="less" scoped>
.trend-index {
}
</style>
