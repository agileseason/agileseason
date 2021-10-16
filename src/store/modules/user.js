import CookieStore from '@/utils/cookie_store';

import api from '@/api';

const NAMESPACE = 'agileseason#store#user';
const DEFAULT_STATE = {
  username: undefined,
  avatarUrl: undefined,
  boards: [],
  isLoading: true
};

function saveCookies(key, value) {
  CookieStore.set(NAMESPACE, key, value);
}

export default {
  namespaced: true,

  state: {
    ...DEFAULT_STATE,
    rememberToken: CookieStore.get(NAMESPACE, 'rememberToken', null),
    issueModalStyle: CookieStore.get(NAMESPACE, 'issueModalStyle', 'center')
  },

  getters: {
    isSignedIn: state => (state.rememberToken != null),
    token: state => (state.rememberToken),
    username: state => (state.username),
    isLoaded: state => (state.username !== undefined)
  },

  actions: {
    async login({ commit }, { rememberToken }) {
      if (rememberToken == null) { return false; }

      commit('LOGIN', rememberToken);
      return true;
    },
    async fetchProfileLazy({ getters, dispatch }) {
      if (getters.isLoaded) { return; }
      return await dispatch('fetchProfile');
    },
    async fetchProfile({ commit, state }) {
      commit('START_LOADING');
      const user = await api.fetchProfile(state.rememberToken);
      commit('FINISH_LOADING');
      if (user == null) { return; }

      commit('FETCH', user);
      return user;
    },
    updateBoard({ commit }, board) {
      commit('UPDATE_BOARD', board);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    updateIssueModelStyle({ state, commit }, { issueModalStyle }) {
      if (issueModalStyle == null) { return; }
      if (issueModalStyle == state.issueModalStyle) { return; }

      commit('UPDATE_ISSUE_MODAL_STYLE', issueModalStyle);
    },
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
      saveCookies('rememberToken', state.rememberToken);
    },
    LOGOUT(state) {
      state = { ...DEFAULT_STATE };
      state.rememberToken = undefined;
      saveCookies('rememberToken', null);
    },
    FETCH(state, user) {
      state.username = user.username;
      state.avatarUrl = user.avatarUrl;
      state.boards = user.boards;
    },
    UPDATE_BOARD(state, { id, name }) {
      const board = state.boards.find(v => v.id === id);
      if (board == null) { return; }
      board.name = name;
    },
    UPDATE_ISSUE_MODAL_STYLE(state, issueModalStyle) {
      state.issueModalStyle = issueModalStyle;
      saveCookies('issueModalStyle', state.issueModalStyle);
    }
  }
};
