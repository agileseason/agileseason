import api from '@/api';

export default {
  namespaced: true,

  state: {
    items: [],
    totalCount: 0,
    isLoading: true
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    )
  },

  actions: {
    async fetch({ commit, getters }, installationId) {
      commit('START_LOADING');
      const data = await api.fetchRepositories(getters.token, installationId);
      commit('FINISH_LOADING');
      if (data == null) { return; }

      commit('FETCH', data);
      return data?.items;
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
    FETCH(state, { items, totalCount }) {
      state.totalCount = totalCount;
      state.items = items;
    }
  }
};
