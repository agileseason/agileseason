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
    )
  },

  actions: {
    async fetch({ commit, getters }, { boardId }) {
      commit('START_LOADING');
      const items = await api.fetchNotes(getters.token, { boardId });
      commit('FINISH_LOADING', items || []);
      return items;
    },
    async createNote({ commit, getters }, { boardId, body }) {
      const result = await api.createNote(
        getters.token,
        { boardId, body }
      );
      if (result?.note == null) {
        alert(result.errors);
      } else {
        commit('ADD_NOTE', result.note);
      }
      return result?.note;
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
    },
    ADD_NOTE(state, note) {
      state.items.push(note);
    }
  }
};
