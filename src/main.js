import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import vmodal from 'vue-js-modal'
Vue.use(vmodal)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
