import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './views/login/Login.vue'
import Erro404 from './views/Erro404.vue'
import Erro404Contatos from './views/contatos/Erro404Contatos.vue'
import EventBus from './event-bus'

const Home = () => import(/* webpackChunkName: "contatos" */'./views/Home.vue')
const ContatosHome = () =>import(/* webpackChunkName: "contatos" */'./views/contatos/ContatosHome.vue')
const ContatoDetalhes =  () =>import(/* webpackChunkName: "contatos" */'./views/contatos/ContatoDetalhes.vue')
const ContatoEditar = () => import(/* webpackChunkName: "contatos" */'./views/contatos/ContatoEditar.vue')
const Contatos = () => import(/* webpackChunkName: "contatos" */'./views/contatos/Contatos.vue')
Vue.use(VueRouter)

const extrairParametroId = route => ({
  id: +route.params.id
})
const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition){
    return new Promise((resolve, reject) => {
      console.log(reject)
      setTimeout(() => {
        if(savedPosition){
          return resolve(savedPosition)
        }
        if(to.hash){
          return resolve({
           selector: to.hash,
           offset: { x: 0, y: 0}
         });
        }
        resolve({ x: 0, y: 0 })
      }, 3000);
    })
  },
  routes: [
    { 
      path: '/contatos',
      component: Contatos,

      alias: ['/meus-contatos', '/lista-de-contatos'],
      props: (route) => {
        const busca = route.query.busca 
        return busca ? { busca } : {}
      },
      children: [
        // Rotas fixas em primeiro para evitar conflitos
        {
          path: 'teste', 
          component: ContatoEditar, },
        { 
          path: ':id(\\d+)', 
          component: ContatoDetalhes, 
          name: 'contato',
          props: extrairParametroId
        },  // meuscontatos.com/contatos/2 | não é necessário colocar a barra
        { 
          // path: ':id(\\d+)/editar/:optional?',
          // path: ':id(\\d+)/editar/:zeroOuMais*',
          // path: ':id(\\d+)/editar/:umOuMais+',
          path: ':id(\\d+)/editar',
          alias: ':id(\\d+)/alterar',
          meta: { requerAutenticacao: true },
          beforeEnter (to, from, next){
            console.log('beforeEnter')
            next() // ou next(true) continua a navegação
            // next(false) // navegação bloqueada
            // next('/contatos') //redirecionar
            // next({ path: ''}) //redirecionar
            // next({ name: 'contatos'}) //redirecionar
            // next(new Error(`Permissões insuficientes para acessor o recurso "${to.fullPath}"`))
          },
          components: {
            default: ContatoEditar,
            'contato-detalhes': ContatoDetalhes
          },
          props: {
            default: extrairParametroId,
            'contato-detalhes': extrairParametroId
          }
        },
        { path: '', component: ContatosHome, name: 'contatos'},
        {
          path: '*',
          component: Erro404Contatos
        },
      ] 
    }, // meuscontatos.com/contatos
    { path: '/home', component: Home }, // meuscontatos.com
    // { path: '/', redirect: '/contatos'},
    { path: '/login', component: Login },
    { 
      path: '/', 
      redirect: () => {
        return {name: 'contatos'}
      }
    },
    {
      path: '*',
      component: Erro404
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach')
  console.log('Requer autenticação? ', to.meta.requerAutenticacao)
  const estaAutenticado = EventBus.autenticado
  console.log("Está autenticado: ", estaAutenticado)
  if(to.matched.some(rota => rota.meta.requerAutenticacao)) {
    if(!estaAutenticado){
      console.log("Não estou autenticado. Logar")
      next({
        path: '/login',
        query: { redirecionar: to.fullPath }
      })
      return
    }
  }
  console.log("Rota não requer autenticação ou já estou autenticado. Prosseguir")
  next()
})

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve')
  next()
})

router.afterEach((to, from) => {
  console.log('AfterEach')
  console.log(to)
  console.log(from)
})

router.onError((erro) => {
  console.log(erro)
})

export default router;