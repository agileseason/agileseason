import api from '@/api';

export default {
  namespaced: true,

  state: {
    // { id: 123, installationId: 321, installationAccessTokenUrl: '...', name: 'name', fullName: 'name/name', isPrivate: true }
    selectedRepositories: [],
    // importedRepositoryIds: [],
    isSubmitting: false
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    isImportReady: (state) => (
      state.selectedRepositories.length > 0
    )
  },

  actions: {
    update({ commit }, { installationId, installationAccessTokenUrl, repositories }) {
      commit('SYNC', { installationId, installationAccessTokenUrl, repositories });
    },
    remove({ commit }, repositoryId) {
      commit('REMOVE', repositoryId);
    },
    // syncImportedRepositoryIds({ commit }, ids) {
    //   commit('SYNC_IMPORTED_REPOSITORY_IDS', ids);
    // },
    async submit({ commit, state, getters }, { boardName }) {
      commit('START_SUBMITTING');
      const board = await api.createBoard(
        getters.token,
        { name: boardName, repositories: state.selectedRepositories }
      );
      commit('FINISH_SUBMITTING');
      if (board == null) { return; }

      return board;
    },
    reset({ commit }) {
      commit('RESET');
    }
  },

  mutations: {
    RESET(state) {
      state.selectedRepositories = [];
    },
    SYNC(state, { installationId, installationAccessTokenUrl, repositories }) {
      const otherInstallation = state.selectedRepositories.filter(v => v.installationId !== installationId);
      const newRepositories = repositories
        .map(v => ({ installationId, installationAccessTokenUrl, ...v }));
      state.selectedRepositories = [...otherInstallation, ...newRepositories];
      // state.importedRepositoryIds = state.selectedRepositories.map(v => v.id);
    },
    REMOVE(state, repositoryId) {
      state.selectedRepositories = state
        .selectedRepositories
        .filter(v => v.id !== repositoryId);
      // state.importedRepositoryIds = state
      //   .importedRepositoryIds
      //   .filter(v => v !== repositoryId);
    },
    // SYNC_IMPORTED_REPOSITORY_IDS(state, ids) {
    //   state.importedRepositoryIds = ids;
    // },
    START_SUBMITTING(state) {
      state.isSubmitting = true;
    },
    FINISH_SUBMITTING(state) {
      state.isSubmitting = false;
      state.selectedRepositories = [];
    }
  }
};
