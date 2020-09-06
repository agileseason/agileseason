import { createStore } from 'vuex';
import pathify from 'vuex-pathify';
import user from './modules/user';
import installations from './modules/installations';

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
    installations
  }
})
