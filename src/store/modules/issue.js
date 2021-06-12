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
    isArchived: undefined,
    repositoryName: undefined,
    repositoryFullName: undefined,
    columnId: undefined,
    isLoading: true,
    isLoaded: false,
    isCommentLoading: false,
    isCommentLoaded: false,
    assignees: [],
    labels: [],
    comments: [],
    color: undefined
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
        commit('UPDATE', issue);
        commit('FINISH_LOADING');
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
    async createComment({ commit, state, getters, dispatch }, { body }) {
      const result = await api.createComment(
        getters.token,
        {
          boardId: getters.boardId,
          repositoryFullName: state.repositoryFullName,
          issueId: state.id,
          body: body
        }
      );
      if (result.comment) {
        commit('ADD_COMMENT', result.comment);
        dispatch(
          'board/updateBoardIssue',
          {
            columnId: state.columnId,
            id: state.id,
            commentsCount: state.comments.length
          },
          { root: true }
        );
      } else {
        console.log(result.errors);
      }

      return result.comment;
    },
    async updateComment({ commit, state, getters }, { id, body }) {
      const result = await api.updateComment(
        getters.token,
        {
          boardId: getters.boardId,
          repositoryFullName: state.repositoryFullName,
          id,
          body
        }
      );
      if (result.errors.length === 0) {
        commit('UPDATE_COMMENT', { id, body });
      } else {
        console.log(result.errors);
      }

      return result;
    },
    async destroyComment({ commit, state, getters, dispatch }, { id }) {
      const result = await api.destroyComment(
        getters.token,
        {
          boardId: getters.boardId,
          repositoryFullName: state.repositoryFullName,
          issueId: state.id,
          id
        }
      );
      if (result.errors.length === 0) {
        commit('REMOVE_COMMENT', id);
        dispatch(
          'board/updateBoardIssue',
          {
            columnId: state.columnId,
            id: state.id,
            commentsCount: state.comments.length
          },
          { root: true }
        );
      } else {
        console.log(result.errors);
      }

      return result;
    },
    update({ commit }, { isClosed, isArchived, body }) {
      commit('UPDATE', { isClosed, isArchived, body });
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
      state.isCommentLoading = false;
      state.isCommentLoaded = false;
      state.assignees = [];
      state.labels = [];
      state.isClosed = false;
    },
    FINISH_LOADING(state) {
      state.isLoading = false;
      state.isLoaded = true;
    },
    UPDATE(state, attrs) {
      // This approach doesn't work:
      // state = { ...state, ...issue }
      Object.keys(attrs).forEach(prop => {
        if (attrs[prop] !== undefined) {
          state[prop] = attrs[prop];
        }
      });
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
    ADD_COMMENT(state, comment) {
      state.comments.push(comment);
    },
    UPDATE_COMMENT(state, { id, body }) {
      const comment = state.comments.find(v => v.id === id);
      if (comment) {
        comment.body = body;
      }
    },
    REMOVE_COMMENT(state, id) {
      const index = state.comments.findIndex(v => v.id === id);
      state.comments.splice(index, 1);
    }
  }
};
