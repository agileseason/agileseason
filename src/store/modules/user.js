import CookieStore from '@/utils/cookie_store';

import api from '@/api';

const NAMESPACE = 'agileseason#store#user';

function saveCookies(key, value) {
  CookieStore.set(NAMESPACE, key, value);
}

export default {
  namespaced: true,

  state: {
    rememberToken: CookieStore.get(NAMESPACE, 'rememberToken', null),
    username: undefined,
    avatarUrl: undefined,
    boards: [],
    isLoading: true
  },

  getters: {
    isSignedIn: state => (state.rememberToken != null),
    token: state => (state.rememberToken)
  },

  actions: {
    async login({ commit }, { rememberToken }) {
      if (rememberToken == null) { return false; }

      commit('LOGIN', rememberToken);
      return true;
    },
    async fetchProfile({ commit, state }) {
      commit('START_LOADING');
      const user = await api.fetchProfile(state.rememberToken);
      commit('FINISH_LOADING');
      if (user == null) { return; }

      commit('FETCH', user);
      return user;
    },
    // async updateProfile({ state }, { currency }) {
    //   const { token } = state;
    //   console.warn('store');
    //   const user = await api.updateProfile(token, { currency });
    //   if (user == null) { return false; }

    //   return true;
    // }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
    },
    LOGIN(state, rememberToken) {
      state.rememberToken = rememberToken;
      // console.log(rememberToken);
      // console.log(state.rememberToken);
      saveCookies('rememberToken', state.rememberToken);
    },
    LOGOUT(state) {
      Object.assign(state);
      saveCookies('rememberToken', null);
    },
    FETCH(state, user) {
      state.username = user.username;
      state.avatarUrl = user.avatarUrl;
      state.boards = user.boards;
    }
  }
};
