import api from '@/api';

const DEFAULT_STATE = {
  id: undefined,
  name: '',
  allRepositories: [],
  linkedRepositories: []
};

export default {
  namespaced: true,

  state: {
    ...DEFAULT_STATE,
    // { id: 123, installationId: 321, installationAccessTokenUrl: '...', name: 'name', fullName: 'name/name', isPrivate: true }
    allRepositories: [],
    linkedRepositories: [],
    isLoading: true,
    isLoaded: false,
    isSyncingIssues: false
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    isImportReady: (state) => (
      state.linkedRepositories.length > 0
    ),
    isNotFound: (state) => (
      !state.isLoading && !state.isLoaded
    )
  },

  actions: {
    async fetch({ commit, getters }, { id }) {
      commit('START_LOADING');
      const settings = await api.fetchBoardSettings(
        getters.token,
        { id }
      );

      if (settings == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', settings);
      }
    },
    reset({ commit }) {
      commit('RESET');
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, settings) {
      const { id, name } = settings;
      state.id = id;
      state.name = name;
      state.isLoading = false;
      state.isLoaded = true;
    },
    NOT_FOUND(state) {
      state = Object.assign(state, DEFAULT_STATE)
      state.isLoading = false;
      state.isLoaded = false;
    },
    RESET(state) {
      state = Object.assign(state, DEFAULT_STATE)
      state.isLoading = false;
      state.isLoaded = false;
    }
  }
};
