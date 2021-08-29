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
    // TODO: Remove boardId from args
    async fetch({ commit, getters }, { boardId }) {
      commit('START_LOADING');
      const items = await api.fetchNotes(getters.token, { boardId });
      commit('FINISH_LOADING', items || []);
      return items;
    },
    // TODO: Remove boardId from args
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
    },
    async updateNote({ commit, getters }, { id, body, isPrivate }) {
      const result = await api.updateNote(
        getters.token,
        {
          boardId: getters.boardId,
          id,
          body,
          isPrivate
        }
      );
      if (result.errors.length === 0) {
        commit('UPDATE_NOTE', { id, body, isPrivate });
      } else {
        console.log(result.errors);
      }

      return result;
    },
    async destroyNote({ commit, getters }, { id }) {
      const result = await api.destroyNote(
        getters.token,
        {
          boardId: getters.boardId,
          id
        }
      );
      if (result.errors.length === 0) {
        commit('REMOVE_NOTE', id);
      } else {
        console.log(result.errors);
      }

      return result;
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
    ADD_NOTE(state, note) {
      state.items = [
        note,
        ...state.items
      ]
    },
    UPDATE_NOTE(state, { id, body, isPrivate }) {
      const note = state.items.find(v => v.id === id);
      if (note) {
        note.body = body;
        note.isPrivate = isPrivate;
      }
    },
    REMOVE_NOTE(state, id) {
      const index = state.items.findIndex(v => v.id === id);
      state.items.splice(index, 1);
    }
  }
};
