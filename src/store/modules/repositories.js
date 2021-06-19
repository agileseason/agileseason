import api from '@/api';

export default {
  namespaced: true,

  state: {},

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    )
  },

  actions: {
    async fetch({ getters }, installationId) {
      let page = 1;
      let totalItems = [];
      while (page <= 10) {
        let data = await api.fetchRepositories(getters.token, installationId, page);
        if (data == null || data.items == null || data.items.length === 0) {
          return totalItems;
        }
        let { items, totalCount } = data;
        totalItems = [...totalItems, ...items];
        if (totalItems.length >= totalCount) {
          return totalItems;
        }
        page++;
      }
      return totalItems;
    }
  },

  mutations: {
  }
};
