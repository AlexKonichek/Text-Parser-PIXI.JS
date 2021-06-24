import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = true;
Vue.config.devtools = true;

new Vue({
  render: h => h(App),
}).$mount('#app')
