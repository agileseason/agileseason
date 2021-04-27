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
    columnId: undefined,
    isLoading: true,
    isLoaded: false,
    isCommentLoading: false,
    isCommentLoaded: false,
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
    },
    FINISH_LOADING(state, issue) {
      // Dont work:
      // state = { ...state, ...issue }
      //
      // To long:
      // state.id = issue.id;
      // state.url = issue.url;
      // state.title = issue.title;
      // state.body = issue.body;
      // state.author = issue.author;
      // state.createdAt = issue.createdAt;
      // state.createdAgo = issue.createdAgo;
      // state.isClosed = issue.isClosed
      // state.repositoryName = issue.repositoryName;
      // state.columnId = issue.columnId;
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
