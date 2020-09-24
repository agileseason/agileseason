import api from '@/api';

const DEFAULT_STATE = {
  id: undefined,
  repositories: [],
  syncedRepositories: []
};

export default {
  namespaced: true,

  state: {
    ...DEFAULT_STATE,
    // { id: 123, installationId: 321, installationAccessTokenUrl: '...', name: 'name', fullName: 'name/name', isPrivate: true }
    repositories: [],
    // { id name fullName isPrivate installationId issuesCount }
    syncedRepositories: [],
    isLoading: false,
    isLoaded: false,
    isSyncing: false
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    isNotFound: (state) => (
      !state.isLoading && !state.isLoaded
    )
  },

  actions: {
    async fetch({ commit, getters }, { id }) {
      commit('START_LOADING');
      const board = await api.fetchBoardSettings(
        getters.token,
        { id }
      );

      if (board == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', board);
      }
    },
    async sync({ commit, getters, state }) {
      commit('START_SYNCING_ISSUES');
      for (const v of state.repositories) {
        const { issuesCount, errors } = await api.syncBoardIssues(
          getters.token,
          {
            id: state.id,
            repository: {
              id: v.id,
              name: v.name,
              fullName: v.fullName,
              isPrivate: v.isPrivate,
              installationId: v.installationId,
              installationAccessTokenUrl: v.installationAccessTokenUrl
            }
          }
        );
        if (errors.length == 0) {
          state.syncedRepositories.push({ id: v.id, issuesCount });
        }
      }
      commit('FINISH_SYNCING_ISSUES');
      commit('RESET');
    },
    reset({ commit }) {
      commit('RESET');
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isSyncing = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, board) {
      const { id, repositories } = board;
      state.id = id;
      state.repositories = repositories.map(v => ({
        id: v.id,
        name: v.name,
        fullName: v.fullName,
        isPrivate: v.isPrivate,
        installationId: v.installationId,
        installationAccessTokenUrl: v.installationAccessTokenUrl
      }));
      state.isLoading = false;
      state.isLoaded = true;
    },
    START_SYNCING_ISSUES(state) {
      state.isSyncing = true;
    },
    FINISH_SYNCING_ISSUES(state) {
      state.isSyncing = false;
    },
    NOT_FOUND(state) {
      state = Object.assign(state, DEFAULT_STATE)
      state.isLoading = false;
      state.isLoaded = false;
      state.isSyncing = false;
    },
    RESET(state) {
      state = Object.assign(state, DEFAULT_STATE)
      state.isLoading = false;
      state.isLoaded = false;
      state.isSyncing = false;
    }
  }
};
