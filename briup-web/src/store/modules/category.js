//引入一个axios
import { get } from '@/utils/request'
import { LineGrid } from '@antv/g2/lib/dependents';
export default {
    // 命名空间
    namespaced: true,
    state: {
        //栏目数组
        categoryArr: []
    },
    mutations: {
        //接受栏目数据
        SET_CATEGORYDATA(state, payload) {
            state.categoryArr = payload
        }
    },
    actions: {
        //{commit} 代替context成为actions方法中的第一个参数
        //直接通过commit（'mutations方法名'，要传递的数据）
        async getAllCategoryData({ commit }, payload) {
            let res = await get('/productCategory/pageQuery', payload);

            commit('SET_CATEGORYDATA', res.data.list)
        }

    }
}

