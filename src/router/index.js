import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index';

import Board from '../views/board.vue'
import BoardNew from '../views/board_new.vue'
import BoardSettings from '../views/board_settings.vue'
import BoardSync from '../views/board_sync.vue'
import Boards from '../views/boards.vue'
import Home from '../views/home.vue'
import Issue from '../views/issue.vue'
import IssueNew from '../views/issue_new.vue'
import OAuth from '../views/oauth.vue'

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
    children: [
      {
        path: 'issues/:issueId/number/:issueNumber',
        name: 'issue',
        component: Issue
      }, {
        path: 'columns/:columnId/issues/new',
        name: 'issue_new',
        component: IssueNew
      }
    ],
    beforeEnter: requireAuth
  }, {
    path: '/boards/:id/settings',
    name: 'board_settings',
    component: BoardSettings,
    beforeEnter: requireAuth
  }, {
    path: '/boards/:id/sync',
    name: 'board_sync',
    component: BoardSync,
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
