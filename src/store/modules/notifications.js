import api from '@/api';

export default {
  namespaced: true,

  state: {
    items: [],
    isLoading: true
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    boardId: (state, getters, rootState) => (
      rootState?.board?.id
    )
  },

  actions: {
    async fetch({ commit, getters }, { boardId }) {
      commit('START_LOADING');
      const items = await api.fetchNotifications(getters.token, { boardId });
      commit('FINISH_LOADING', items || []);
      return items;
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
    }
  }
};
