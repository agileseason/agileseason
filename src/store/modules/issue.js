import api from '@/api';

export default {
  namespaced: true,

  state: {
    id: undefined,
    url: undefined,
    title: undefined,
    body: undefined,
    author: undefined,
    createdAt: undefined,
    createdAgo: undefined,
    isClosed: undefined,
    repositoryName: undefined,
    repositoryFullName: undefined,
    columnId: undefined,
    isLoading: true,
    isLoaded: false,
    isCommentLoading: false,
    isCommentLoaded: false,
    assignees: [],
    labels: [],
    comments: []
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    boardId: (state, getters, rootState) => (
      rootState?.board?.id
    ),
    isNotFound: (state) => (!state.isLoading && !state.isLoaded)
  },

  actions: {
    async fetch({ commit, getters }, { id }) {
      commit('START_LOADING');
      const { issue } = await api.fetchIssue(
        getters.token,
        { boardId: getters.boardId, id }
      );
      if (issue == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', issue);
      }
    },
    async fetchComments({ commit, getters }, { id }) {
      commit('START_COMMENTS_LOADING');
      const comments = await api.fetchIssueComments(
        getters.token,
        { boardId: getters.boardId, id }
      );
      commit('FINISH_COMMENTS_LOADING', comments);
      return comments;
    },
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
      state.isCommentLoading = false;
      state.isCommentLoaded = false;
      state.assignees = [];
      state.labels = [];
    },
    FINISH_LOADING(state, issue) {
      // This approach doesn't work:
      // state = { ...state, ...issue }
      Object.keys(issue).forEach(prop => {
        state[prop] = issue[prop];
      });

      state.isLoading = false;
      state.isLoaded = true;
    },
    NOT_FOUND(state) {
      state.isLoading = false;
      state.isLoaded = false;
    },
    START_COMMENTS_LOADING(state) {
      state.isCommentLoading = true;
      state.isCommentLoaded = false;
    },
    FINISH_COMMENTS_LOADING(state, comments) {
      state.comments = comments;

      state.isCommentLoading = false;
      state.isCommentLoaded = true;
    },
  }
};
