import { createStore } from 'vuex';
import pathify from 'vuex-pathify';
import user from './modules/user';
import installations from './modules/installations';
import repositories from './modules/repositories';

export default createStore({
  plugins: [pathify.plugin],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    installations,
    repositories
  }
})
