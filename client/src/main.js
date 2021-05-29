import Vue from 'vue'
import App from './App.vue'
import store from '@/store/store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  beforeCreate() { this.$store.commit('initialiseStore'); },
}).$mount('#app')
