import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueMaterial from 'vue-material'

Vue.prototype.$http = axios
Vue.use(VueMaterial)

new Vue({
  el: '#app',
  render: h => h(App)
})
