// 系统管理仓库
import { pageQuery } from '@/api/user'
export default {
  namespaced: true,
  state: {
    Systems: [],
    SystemTotal: 0
  },
  mutations: {
    SET_SYSTEMS(state, payload) {
      state.Systems = payload
    },
    SET_SYSTEM_TOTAL(state, payload) {
      state.SystemTotal = payload
    }

  },
  actions: {
    //  分页查询系统信息
    async pageQuerySystem({ commit }, payload) {
      const res = await pageQuery(payload)
      commit('SET_SYSTEMS', res.data.list)
      commit('SET_SYSTEM_TOTAL', res.data.total)
    }
  }
}

