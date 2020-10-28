import api from '@/api';

export default {
  namespaced: true,

  state: {
    id: undefined,
    title: undefined,
    body: undefined,
    author: undefined,
    isLoading: true,
    isLoaded: false
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    boardId: (state, getters, rootState) => (
      rootState?.board?.id
    ),
    isNotFound: (state) => (!state.isLoading && !state.isLoaded)
  },

  actions: {
    async fetch({ commit, getters }, { id }) {
      commit('START_LOADING');
      console.log(getters.boardId);
      const { issue } = await api.fetchIssue(
        getters.token,
        { boardId: getters.boardId, id }
      );
      if (issue == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', issue);
      }
    },
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, issue) {
      const { id, title, body, author } = issue;
      state.id = id;
      state.title = title;
      state.body = body;
      state.author = author;

      state.isLoading = false;
      state.isLoaded = true;
    },
    NOT_FOUND(state) {
      state.isLoading = false;
      state.isLoaded = false;
    }
  }
};
