import { createStore } from 'vuex';
import pathify from 'vuex-pathify';

import board from './modules/board';
import boardNew from './modules/board_new';
import boardSettings from './modules/board_settings';
import boardSync from './modules/board_sync';
import installations from './modules/installations';
import issue from './modules/issue';
import repositories from './modules/repositories';
import user from './modules/user';

export default createStore({
  plugins: [pathify.plugin],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    board,
    boardNew,
    boardSettings,
    boardSync,
    installations,
    issue,
    repositories,
    user
  }
})
