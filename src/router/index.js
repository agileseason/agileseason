import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home.vue'
import OAuth from '../views/oauth.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/oauth/callback',
    name: 'oauth',
    component: OAuth
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
