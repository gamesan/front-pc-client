/*
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-14 14:55:34
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-26 17:21:49
 */
class ClientIndexeddb {

  #db
  #version
  #objectType
  #objectName
  #indexNames

  /**
   * 
   * @param {string} dbName 数据库名称
   * @param {string} objectName 表对象名
   * @param {array} indexNames 初始化创建表对象索引的数组
   * @param {function} openSuc 初始化打开数据库成功回调函数
   * @param {function} openErr 初始化打开数据库失败回调函数
   */
  constructor(dbName, objectName, indexNames = [], openSuc = () => {}, openErr = () => {}) {
    this.dbName = dbName
    this.objectName = objectName
    this.indexNames = indexNames
    this.openSuc = openSuc
    this.openErr = openErr
  }

  /**
   * 初始化方法
   */
  initDb() {
    const request = window.indexedDB.open(this.dbName)
    request.onerror = () => {
      this.openErr()
    }
    request.onsuccess = (event) => {
      this.#db = request.result
      this.#version = request.result.version
      this.openSuc(request.result, request.result.version)
    }
    request.onupgradeneeded = (event) => {
      this.#db = event.target.result
      this._createObjectAndIndexs(this.objectName, this.indexNames)
      
    }
  }

  /**
   * 私有方法创建表对象和索引
   * @param {string} objectName 表对象名称
   * @param {array} indexNames 表对象索引数组
   */
  _createObjectAndIndexs(objectName, indexNames = []) {
    let objectStore
    if (!this.#db.objectStoreNames.contains(objectName)) {
      objectStore = this.#db.createObjectStore(objectName, {
        keyPath: 'id',
        autoIncrement: true
      })
    } else {
      objectStore = this.#db.objectStore(objectName)
    }
    for (let i = 0; i < indexNames.length; i++) {
      const item = indexNames[i]
      if (!objectStore.indexNames.contains(item)) {
        // 创建索引字段
        objectStore.createIndex(item, item, {
          unique: false
        })
      }
    }
  }

  /**
   * 删除数据库方法
   * @param {*} dbName 数据库名
   */
  deleteDB(dbName) {
    window.indexedDB.deleteDatabase(dbName)
  }

  /**
   * 新增表对象的方法
   * @param {string} objectName 表对象名称
   * @param {array} indexNames 表对象索引数组
   */
  addObject(objectName, indexNames = []) {
    this.#objectType = 'add'
    this.#objectName = objectName
    this.#indexNames = indexNames
    window.indexedDB.open(this.dbName, ++this.#version)
  }

  /**
   * 删除表对象的方法
   * @param {string} objectName 删除的表对象名称
   */
  deleteObject(objectName) {
    this.#objectType = 'delete'
    this.#objectName = objectName
    window.indexedDB.open(this.dbName, ++this.#version)
  }

  /**
   * 通过查询条件查询数据
   * @param {object} params 查询条件
   * @param {number} currentPage 当前页数 默认 1
   * @param {number} pageSize 每页条数 默认 10
   * @param {string} order 排序 prev 倒序， next 正序  默认 prev
   * @returns 返回 Promise
   */
  selectData(params = {}, currentPage = 1, pageSize = 10, order = 'prev') {
    return new Promise((resovle, reject) => {
      const result = {
        list: [],
        total: 0
      }
      const store = this.#db
        .transaction([this.objectName], 'readonly')
        .objectStore(this.objectName)
      let request
      if (JSON.stringify(params) !== '{}') {
        for (let key in params) {
          if (params[key] !== '') {
            request = store.index(key).openCursor(params[key], order)
          }
        }
        if (!request) {
          request = store.openCursor(null, order)
        }
      } else {
        request = store.openCursor(null, order)
      }
      const count = store.count()
      let index = null
      request.onsuccess = (event) => {
        const res = event.target.result
        // console.log(res, count)
        if (res) {
          if (index === pageSize - 1) {
            result.list.push(res.value)
            result.total = count.result
            resovle({
              type: 'success',
              data: result
            })
            return
          }
          if (index === null && currentPage !== 1) {
            index = 0
            res.advance((currentPage - 1) * pageSize)
          } else {
            index++
            result.list.push(res.value)
            res.continue()
          }
        } else {
          result.total = result.list.length ? count.result : 0
          resovle({
            type: 'success',
            data: result
          })
        }
      }

      request.onerror = () => {
        reject({
          type: 'error',
          data: null
        })
      }
    })
  }

  /**
   * 通过主键id查询数据
   * @param {number} id 主键 id
   * @returns 返回 Promise
   */
  getData(id) {
    return new Promise((resolve, reject) => {
      const request = this.#db.transaction([this.objectName], 'readonly').objectStore(this.objectName).get(id)
      request.onsuccess = (event) => {
        const res = event.target.result
        resolve({
          type: 'success',
          data: res
        })
      }
      request.onerror = () => {
        reject({
          type: 'error',
          data: ''
        })
      }
    })
  }

  /**
   * 修改数据
   * @param {object} params 修改数据
   * @returns 返回 Promise
   */
  putData(params = {}) {
    return new Promise((resolve, reject) => {
      const data = Object.assign({}, params)
      // for (let key in params) {
      //   data[key] = params[key]
      // }

      const request = this.#db
        .transaction([this.objectName], 'readwrite')
        .objectStore(this.objectName)
        .put(data)
      request.onsuccess = () => {
        resolve({
          type: 'success',
          data: ''
        })
      }
      request.onerror = () => {
        reject({
          type: 'error',
          data: ''
        })
      }
    })
  }

  /**
   * 添加数据
   * @param {object} params 新增数据对象值
   * @returns 返回 Promise
   */
  addData(params = {}) {
    return new Promise((resolve, reject) => {
      const data = {}
      for (let key in params) {
        data[key] = params[key]
      }
      console.log(this.#db)
      const request = this.#db
        .transaction([this.objectName], 'readwrite')
        .objectStore(this.objectName)
        .add(data)
      request.onsuccess = () => {
        resolve({
          type: 'success',
          data: ''
        })
      }
      request.onerror = () => {
        reject({
          type: 'error',
          data: ''
        })
      }
    })
  }

  /**
   * 通过主键id删除数据
   * @param {number} id 主键 id
   * @returns 返回 Promise
   */
  deleteData(id) {
    return new Promise((resolve, reject) => {
      const request = this.#db.transaction([this.objectName], 'readwrite').objectStore(this.objectName).delete(id)

      request.onsuccess = () => {
        resolve({
          type: 'success',
          data: ''
        })
      }
      request.onerror = () => {
        reject({
          type: 'error',
          data: ''
        })
      }
    })
  }
}

export default ClientIndexeddb
