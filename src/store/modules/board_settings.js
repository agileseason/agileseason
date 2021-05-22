import api from '@/api';

const DEFAULT_STATE = {
  id: undefined,
  name: '',
  allRepositories: [],
  linkedRepositories: [],
  invites: []
};

export default {
  namespaced: true,

  state: {
    ...DEFAULT_STATE,
    // { id: 123, installationId: 321, installationAccessTokenUrl: '...', name: 'name', fullName: 'name/name', isPrivate: true }
    allRepositories: [],
    // { id name fullName isPrivate installationId issuesCount }
    linkedRepositories: [],
    pendingRepositories: [],
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
    ),
    repositories: (state) => {
      const linkedRepositories = state
        .linkedRepositories
        .map(repo => (
          {
            ...repo,
            issuesCount: state.pendingRepositories.find(v => v.id === repo.id) ?
              repo.issuesCount :
              'Remove'
          }
        ));
      const addedRepositories = state
        .pendingRepositories
        .filter(repo => !state.linkedRepositories.map(v => v.id).includes(repo.id))
        .map(repo => (
          { ...repo, issuesCount: 'Add' }
        ));
      return [...linkedRepositories, ...addedRepositories];
    }
  },

  actions: {
    async fetch({ commit, getters, dispatch }, { id }) {
      commit('START_LOADING');
      const settings = await api.fetchBoardSettings(
        getters.token,
        { id }
      );

      await dispatch('installations/fetch', null, { root: true });
      if (settings == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', settings);
      }
    },
    update({ commit }, { installationId, installationAccessTokenUrl, repositories }) {
      commit('SYNC_PENDING_REPOSITORIES', { installationId, installationAccessTokenUrl, repositories });
    },
    async save({ commit, getters, state }, { id }) {
      commit('START_SYNCING_ISSUES');
      const { errors } = await api.saveBoardSettings(
        getters.token,
        {
          id,
          repositories: state.pendingRepositories.map(v => (
            {
              id: v.id,
              name: v.name,
              fullName: v.fullName,
              isPrivate: v.isPrivate,
              installationId: v.installationId,
              installationAccessTokenUrl: v.installationAccessTokenUrl
            }
          ))
        }
      );
      if (errors.length > 0) {
        commit('FINISH_SYNCING_ISSUES');
        return { isValid: false, errors };
      }

      return { isValid: true, errors };
    },
    reset({ commit }) {
      commit('RESET');
    },

    async destroyBoard({ getters }, { id }) {
      const result = await api.destroyBoard(getters.token, { id });
      if (result.errors.length) {
        console.error(result.errors);
      }
      return result.errors;
    },

    async createInvite({ state, getters, commit }, { login, avatarUrl }) {
      const result = await api.createInvite(getters.token, {
        boardId: state.id,
        login,
        avatarUrl
      });

      if (result.errors.length) {
        console.error(result.errors);
      } else {
        commit('ADD_INVITE', result);
      }
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
      state.linkedRepositories = settings.repositories;
      state.pendingRepositories = settings.repositories;
      state.invites = settings.invites;
      state.isLoading = false;
      state.isLoaded = true;
    },
    START_SYNCING_ISSUES(state) {
      state.isSyncingIssues = true;
    },
    FINISH_SYNCING_ISSUES(state) {
      state.isSyncingIssues = false;
    },
    SYNC_PENDING_REPOSITORIES(state, { installationId, installationAccessTokenUrl, repositories }) {
      const otherInstallation = state
        .pendingRepositories
        .filter(v => v.installationId !== installationId);

      const newRepositories = repositories
        .map(v => ({ installationId, installationAccessTokenUrl, ...v }));
      state.pendingRepositories = [...otherInstallation, ...newRepositories];
    },
    NOT_FOUND(state) {
      state = Object.assign(state, DEFAULT_STATE)
      state.isLoading = false;
      state.isLoaded = false;
      state.isSyncingIssues = false;
    },
    RESET(state) {
      state = Object.assign(state, DEFAULT_STATE)
      state.isLoading = false;
      state.isLoaded = false;
      state.isSyncingIssues = false;
    },
    ADD_INVITE(state, invite) {
      if (state.invites.find(v => v.id === invite.id)) { return; }
      state.invites.push(invite);
    }
  }
};
