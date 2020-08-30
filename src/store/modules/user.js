import CookieStore from '@/utils/cookie_store';

import api from '@/api';

const NAMESPACE = 'agileseason#store#user';

function saveCookies(key, value) {
  CookieStore.set(NAMESPACE, key, value);
}

export default {
  namespaced: true,

  state: {
    username: CookieStore.get(NAMESPACE, 'username', null),
    rememberToken: CookieStore.get(NAMESPACE, 'rememberToken', null)
  },

  getters: {
    isSignedIn: state => (state.username != null && state.rememberToken != null)
  },

  actions: {
    async login({ commit }, { rememberToken }) {
      if (rememberToken == null) { return false; }

      commit('LOGIN', rememberToken);
      return true;
    },
    async fetchProfile({ commit, state }) {
      const { token } = state;
      const user = await api.fetchProfile(token);
      if (user == null) { return; }

      commit('FETCH', user);
      return true;
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
      state.email = user.email;
      state.currency = user.defaultCurrency;
    }
  }
};
