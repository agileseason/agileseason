import { createStore } from 'vuex';
import pathify from 'vuex-pathify';
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
    user
  }
})
