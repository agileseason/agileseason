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
import Settings from '../views/settings';
import SharedBoard from '../views/shared_board';
import SharedIssue from '../views/shared_issue';

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
    component: SharedBoard,
    children: [
      {
        path: 'issues/:issueId/number/:issueNumber',
        name: 'sharedIssue',
        component: SharedIssue
      }
    ]
  }, {
    path: '/boards',
    name: 'boards',
    component: Boards,
    beforeEnter: requireAuth,
    children: [
      {
        path: 'search',
        name: 'search',
        components: {
          center: () => import('../views/search.vue')
        }
      }
    ]
  }, {
    path: '/boards/:id(\\d+)',
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
      }, {
        path: 'search',
        name: 'search_board',
        components: {
          center: () => import('../views/search.vue')
        }
      }, {
        path: 'notifications',
        name: 'notifications',
        components: {
          center: () => import('../views/notifications.vue')
        }
      }, {
        path: 'notes',
        name: 'notes',
        components: {
          center: () => import('../views/notes.vue')
        }
      }, {
        path: 'charts/age',
        name: 'issues_age_chart',
        components: {
          center: () => import('../views/charts/issues_age.vue')
        }
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
    path: '/settings',
    name: 'settings',
    component: Settings,
    beforeEnter: requireAuth
  }, {
    path: '/oauth/callback',
    name: 'oauth',
    component: OAuth
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
