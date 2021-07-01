import { get, post, post_json } from '@/http/axios'

export default {
    namespaced: true,
    state: {
        productData: []
    },
    mutations: {
        SET_PRODUCTDATA(state, payload) {
            state.productData = payload
        }
    },
    actions: {
        //获取栏目的数据
        async getAllProductData({ commit }, payload) {
            let res = await get('/product/pageQuery', payload)
            //console.log(res);
            commit('SET_PRODUCTDATA', res.data.data.list)
        }
    },

}
