import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  // 该插件会将vuex中数据持久化，可通过配置来决定哪些数据需要持久化
  plugins: [createPersistedState()],

  state: {
    time: 0,
    data: {
      name: '张三',
      age: 28
    }
  },

  mutations: {
    setTime: (state, time) => {
      state.time = time
    },
    setData: (state, data) => {
      state.data = data
    }
  }
})
