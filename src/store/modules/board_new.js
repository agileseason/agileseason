// import api from '@/api';

export default {
  namespaced: true,

  state: {
    // { id: 123, installationId: 321, name: 'name', fullName: 'name/name', isPrivate: true }
    selectedRepositories: []
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
    }
    // async fetch({ commit, getters }, installationId) {
    //   commit('START_LOADING');
    //   const data = await api.fetchRepositories(getters.token, installationId);
    //   commit('FINISH_LOADING');
    //   if (data == null) { return; }

    //   commit('FETCH', data);
    //   return data?.items;
    // },
  },

  mutations: {
    RESET(state) {
      state.selectedRepositories = [];
    },
    SYNC(state, { installationId, repositories }) {
      const otherInstallation = state.selectedRepositories.filter(v => v.installationId !== installationId);
      const newRepositories = repositories.map(v => ({ installationId, ...v }));
      state.selectedRepositories = [...otherInstallation, ...newRepositories];
    },
    REMOVE(state, repositoryId) {
      state.selectedRepositories = state
        .selectedRepositories
        .filter(v => v.id !== repositoryId);
    },
    // START_LOADING(state) {
    //   state.isLoading = true;
    // },
    // FINISH_LOADING(state, items) {
    //   state.items = items;
    //   state.isLoading = false;
    // },
    // FETCH(state, { items, totalCount }) {
    //   state.totalCount = totalCount;
    //   state.items = items;
    // }
  }
};
