import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import Briupdrawer from '@/components/Briupdrawer'
import BriupMap from '@/components/BriupMap'
import PhoneChart from '@/components/PhoneChart'

// 引入暴露的防抖节流函数
import { inputDebounceThrot, buttonThrot } from './utils/mx'
// 自定义指令v-inputDebounceThrot input搜索框输入搜索时防抖+回车键节流
// 参数：  func    事件回调函数
//         wait    输入事件防抖时间，默认为1000ms
//         enterWait   回车事件节流时间,默认为1000ms
Vue.directive('searchDebounceAndThrotFromMx', {
  bind(el, binding) {
    const inputFunc = inputDebounceThrot(binding.value, 500, 1000)
    el.addEventListener('keyup', inputFunc)
  }
})
// 自定义指令v-buttonThrotFromMx  搜索按钮节流
// 参数：  func    事件回调函数
//         wait    点击事件节流时间，默认为1000ms
Vue.directive('buttonThrotFromMx', {
  bind(el, binding) {
    const btnFunc = buttonThrot(binding.value, 1000)
    el.addEventListener('click', btnFunc)
  }
})

// 自定义组件
Vue.component('Briupdrawer', Briupdrawer)
Vue.component('BriupMap', BriupMap)
Vue.component('PhoneChart', PhoneChart)

import Vant from 'vant'
import 'vant/lib/index.css'

import '@/styles/university.css'

Vue.use(Vant)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
