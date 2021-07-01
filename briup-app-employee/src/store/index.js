import Vue from 'vue'
import Vuex from 'vuex'
// 引入注册模块
import register from './register/register'
// 引入用户模块
import user from './user/user'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    // 注册模块
    register,
    // 用户模块
    user,


  }
})
