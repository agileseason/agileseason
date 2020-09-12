import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index';

import Home from '../views/home.vue'
import OAuth from '../views/oauth.vue'
import Board from '../views/board.vue'
import Boards from '../views/boards.vue'
import BoardNew from '../views/board_new.vue'

function requireAuth(to, from, next) {
  if (!store.getters['user/isSignedIn']) {
    next({ path: '/', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/boards',
    name: 'boards',
    component: Boards,
    beforeEnter: requireAuth
  }, {
    path: '/boards/:id',
    name: 'board',
    component: Board,
    beforeEnter: requireAuth
  }, {
    path: '/boards/new',
    name: 'board_new',
    component: BoardNew,
    beforeEnter: requireAuth
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
