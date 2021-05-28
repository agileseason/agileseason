import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/index';

import Board from '../views/board';
import BoardNew from '../views/board_new';
import BoardSettings from '../views/board_settings';
import BoardSync from '../views/board_sync';
import Boards from '../views/boards';
import Home from '../views/home';
import Invite from '../views/invite';
import Issue from '../views/issue';
import IssueNew from '../views/issue_new';
import OAuth from '../views/oauth';
import SharedBoard from '../views/shared_board';

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
    path: '/i/:token',
    name: 'invite',
    component: Invite
  }, {
    path: '/shared/board/:token',
    name: 'shared_board',
    component: SharedBoard
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
