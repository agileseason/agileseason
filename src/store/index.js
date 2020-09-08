import { createStore } from 'vuex';
import pathify from 'vuex-pathify';

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
    boardNew,
    installations,
    repositories,
    user
  }
})
