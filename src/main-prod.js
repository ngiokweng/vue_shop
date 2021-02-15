import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/gobal.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import Moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

import NProgress from 'nprogress'

Vue.use(VueQuillEditor)
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// axios擦攔截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.filter('dateFormat', function(value, format = 'YYYY-MM-DD HH:mm:ss') {
  return Moment(value).format(format)
})

Vue.component('tree-table', TreeTable)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
