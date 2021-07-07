import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Contatos from './views/contatos/Contatos.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/contatos', component: Contatos }, // meuscontatos.com/contatos
    { path: '/', component: Home } // meuscontatos.com
  ]
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
