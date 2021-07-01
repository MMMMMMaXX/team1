// 员工管理仓库
import { pageQuery } from '@/api/user'
export default {
  namespaced: true,
  state: {
    employees: [],
    employeeTotal: 0
  },
  mutations: {
    SET_EMPLOYEES(state, payload) {
      state.employees = payload
    },
    SET_EMPLOYEE_TOTAL(state, payload) {
      state.employeeTotal = payload
    }

  },
  actions: {
    //  分页查询员工信息
    async pageQueryEmployee({ commit }, payload) {
      const res = await pageQuery(payload)
      commit('SET_EMPLOYEES', res.data.list)
      commit('SET_EMPLOYEE_TOTAL', res.data.total)
    }
  }
}

