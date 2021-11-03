import Vue from 'vue'
import App from './App.vue'
import store from '@/store/store'
import Axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import vSelect from 'vue-select'
import VueSocketIO from 'vue-socket.io'

import 'vue-select/dist/vue-select.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.component('v-select', vSelect)

Vue.config.productionTip = false

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

// Socket.io connections
Vue.use(new VueSocketIO({
  debug: false,
  connection: process.env.VUE_APP_SOCKET_IO_CONNECTION,
}))

new Vue({
  render: h => h(App),
  store,
  beforeCreate() { this.$store.commit('initialiseStore'); },
}).$mount('#app')
