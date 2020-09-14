import { createStore } from 'vuex';
import pathify from 'vuex-pathify';

import board from './modules/board';
import boardNew from './modules/board_new';
import installations from './modules/installations';
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
    installations,
    repositories,
    user
  }
})
