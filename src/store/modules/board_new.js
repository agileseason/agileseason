import api from '@/api';

export default {
  namespaced: true,

  state: {
    // { id: 123, installationId: 321, name: 'name', fullName: 'name/name', isPrivate: true }
    selectedRepositories: [],
    importedRepositoryIds: [],
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
    reset({ commit }) {
      commit('RESET');
    },
    update({ commit }, { installationId, repositories }) {
      commit('SYNC', { installationId, repositories });
    },
    remove({ commit }, repositoryId) {
      commit('REMOVE', repositoryId);
    },
    syncImportedRepositoryIds({ commit }, ids) {
      commit('SYNC_IMPORTED_REPOSITORY_IDS', ids);
    },
    async submit({ commit, getters }, { boardName }) {
      commit('START_SUBMITTING');
      const data = await api.createBoard(getters.token, { boardName, todo: 'todo'});
      commit('FINISH_SUBMITTING');
      if (data == null) { return; }

      return data?.items;
    }
  },

  mutations: {
    RESET(state) {
      state.selectedRepositories = [];
    },
    SYNC(state, { installationId, repositories }) {
      const otherInstallation = state.selectedRepositories.filter(v => v.installationId !== installationId);
      const newRepositories = repositories.map(v => ({ installationId, ...v }));
      state.selectedRepositories = [...otherInstallation, ...newRepositories];
      state.importedRepositoryIds = state.selectedRepositories.map(v => v.id);
    },
    REMOVE(state, repositoryId) {
      state.selectedRepositories = state
        .selectedRepositories
        .filter(v => v.id !== repositoryId);
      state.importedRepositoryIds = state
        .importedRepositoryIds
        .filter(v => v !== repositoryId);
    },
    SYNC_IMPORTED_REPOSITORY_IDS(state, ids) {
      state.importedRepositoryIds = ids;
    },
    START_SUBMITTING(state) {
      state.isSubmitting = true;
    },
    FINISH_SUBMITTING(state) {
      state.isSubmitting = false;
    }
  }
};
