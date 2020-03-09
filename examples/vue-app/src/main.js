import Vue from 'vue'
import App from './App.vue'

import * as VueWechat from '../../../dist/vue.esm'

Vue.config.productionTip = false

Vue.use(VueWechat)

new Vue({
  render: h => h(App)
}).$mount('#app')
