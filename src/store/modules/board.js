import api from '@/api';

export default {
  namespaced: true,

  state: {
    id: undefined,
    name: undefined,
    columns: [],
    isLoading: true,
    isLoaded: false
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    isNotFound: (state) => (!state.isLoading && !state.isLoaded)
  },

  actions: {
    async fetch({ commit, getters }, { id }) {
      commit('START_LOADING');
      const board = await api.fetchBoard(
        getters.token,
        { id }
      );
      if (board == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', board);
      }
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, board) {
      const { id, name, columns } = board;
      state.id = id;
      state.name = name;
      state.columns = columns;
      state.isLoading = false;
      state.isLoaded = true;
    },
    NOT_FOUND(state) {
      state.isLoading = false;
      state.isLoaded = false;
    }
  }
};
