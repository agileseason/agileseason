import api from '@/api';

export default {
  namespaced: true,

  state: {
    id: undefined,
    name: undefined,
    isOwner: undefined,
    columns: [],
    repositories: [],
    isLoading: true,
    isLoaded: false,
    currentIssue: {}
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    isNotFound: (state) => (!state.isLoading && !state.isLoaded),
    mentionIssues: (state) => {
      if (!state.isLoaded) { return []; }

      return state.columns
        .map(v => v.issues)
        .flat(1)
        .map(v => ({ label: `#${v.number} - ${v.title}`, value: v.number }));
    }
  },

  actions: {
    async fetch({ commit, getters }, { id }) {
      commit('START_LOADING');
      const board = await api.fetchBoard(
        getters.token,
        { id }
      );
      if (board == null) {
        commit('NOT_FOUND');
      } else {
        commit('FINISH_LOADING', board);
      }
    },

    async createColumn({ commit, state, getters }, { name }) {
      const column = await api.createColumn(
        getters.token,
        { name, boardId: state.id }
      );
      if (column?.id == null) {
        // todo: Show errors (column.errors).
      } else {
        commit('ADD_COLUMN', column);
      }
    },

    // TODO: remove
    async updateColumnPositions({ state, getters }, { columns }) {
      const result = await api.updateColumnPositions(
        getters.token,
        { boardId: state.id, columns }
      );
      if (result?.errors?.length == 0) {
        console.log('success');
      } else {
        console.error(result.errors[0]);
      }
    },

    async moveColumn({ getters, state }, { fromColumnIndex, toColumnIndex }) {
      const columns = state.columns
      const columnToMove = columns.splice(fromColumnIndex, 1)[0]
      columns.splice(toColumnIndex, 0, columnToMove)
      columns.map((v, index) => v.position = index);
      const result = await api.updateColumnPositions(
        getters.token,
        { boardId: state.id, columns }
      );
      if (result?.errors?.length == 0) {
        console.log('success');
      } else {
        console.error(result.errors[0]);
      }
    },

    async fetchAssignableUsers({ state, getters }, { repositoryFullName }) {
      const result = await api.fetchAssignableUsers(
        getters.token,
        state.id,
        repositoryFullName
      );

      if (result == null) {
        console.log('Error: fetchAssignableUsers');
        return [];
      }
      return result;
    },

    async fetchLabels({ state, getters }, { repositoryFullName }) {
      const result = await api.fetchLabels(
        getters.token,
        state.id,
        repositoryFullName
      );

      if (result == null) {
        console.log('Error: fetchLabels');
        return [];
      }
      return result;
    },

    async createIssue({ commit, state, getters }, { columnId, repositoryId, title, body, position, assignees, labels, color }) {
      const result = await api.createIssue(
        getters.token,
        { boardId: state.id, columnId, repositoryId, title, body, position, assignees, labels, color }
      );
      if (result?.issue == null) {
        // todo: Show errors (result.errors).
      } else {
        commit('ADD_ISSUE', result.issue);
      }
      return result?.issue;
    },

    async updateIssue({ state, getters, dispatch }, { id, columnId, title, body, assignees, labels, color }) {
      const result = await api.updateIssue(
        getters.token,
        { id: id, boardId: state.id, title, body, assignees, labels, color }
      );
      if (result?.issue == null) {
        // todo: Show errors (result.errors).
        console.error(result.errors[0]);
      } else {
        dispatch('updateBoardIssue', { id, title, body, columnId, assignees, labels, color });
      }
      return result?.issue;
    },

    async updateIssueState({ state, getters, dispatch }, { id, columnId, isClosed, isArchived }) {
      const result = await api.updateIssueState(
        getters.token,
        { id: id, boardId: state.id, isClosed, isArchived }
      );
      if (result?.issue == null) {
        // todo: Show errors (result.errors).
        console.error(result.errors);
      } else {
        dispatch('updateBoardIssue', { id, columnId, isClosed, isArchived });
        dispatch('issue/update', { isClosed, isArchived }, { root: true });
      }
      return result?.issue;
    },

    removeIssue({ state, getters }, { issueId, columnToId }) {
      console.log('removeIssue');
      console.log('issueId: ' + issueId);
      console.log('columnToId: ' + columnToId);

      const columnTo = state.columns.find(v => v.id === columnToId);
      if (columnTo == null) {
        console.log('unknown columnTo!');
        return;
      }

      let issue = null;
      state.columns.forEach(column => {
        const tmpIssue = column.issues.find(v => v.id == issueId);
        if (tmpIssue) {
          issue = tmpIssue;
          column.issues = column.issues.filter(v => v.id != issueId);
        }
      });
      if (issue == null) {
        console.log('unknown issue!');
      } else {
        console.log('add issue to column: ' + columnTo.id);
        columnTo.issues = [issue, ...columnTo.issues];
        const result = api.moveIssues(
          getters.token,
          {
            boardId: state.id,
            columnId: columnToId,
            issueIds: columnTo.issues.map(v => v.id)
          }
        );
        if (result?.errors?.length > 0) {
          console.error(result.errors);
        }
      }
    },

    setCurrentIssue({ commit }, { issue }) {
      // { id, number, title, url, repositoryName, isClosed }
      commit('SET_CURRENT_ISSUE', issue);
    },

    updateBoardIssue({ commit, state }, issue) {
      const column = state.columns.find(v => v.id === issue.columnId);
      if (column == null) { return; }

      const boardIssue = column.issues.find(v => v.id === issue.id);
      if (boardIssue == null) { return; }

      Object.keys(issue).forEach(prop => {
        if (issue[prop] !== undefined) {
          commit(
            'UPDATE_BOARD_ISSUE',
            { issue: boardIssue, key: prop, value: issue[prop] }
          );
        }
      });
      if ('body' in issue) {
        commit(
          'UPDATE_BOARD_ISSUE',
          { issue: boardIssue, key: 'isBody', value: !!issue.body }
        );
      }
    },

    async update({ getters, commit, dispatch }, { id, name }) {
      const result = await api.updateBoard(getters.token, { id, name });
      if (result.errors.length) {
        console.error(result.errors);
      } else {
        commit('UPDATE_BOARD', { name });
        dispatch('user/updateBoard', { id, name }, { root: true });
      }
    },

    async updateBoardColumn({ getters, state }, { id, name }) {
      const column = state.columns.find(v => v.id === id);
      if (column == null) { return; }

      const result = await api.updateColumn(getters.token, { id, name, boardId: state.id });
      if (result.errors.length === 0) {
        column.name = name;
      }
    },

    async removeBoardColumn({ getters, state }, { id }) {
      const index = state.columns.findIndex(v => v.id === id);
      if (index === -1) { return; }

      const result = await api.destroyColumn(getters.token, { id, boardId: state.id });
      if (result.errors.length === 0) {
        state.columns.splice(index, 1);
      }

      return result.errors.length === 0;
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, board) {
      const { id, name, columns, repositories, isOwner } = board;
      state.id = id;
      state.name = name;
      state.isOwner = isOwner;
      state.columns = columns;
      state.repositories = repositories;
      state.isLoading = false;
      state.isLoaded = true;
    },
    NOT_FOUND(state) {
      state.isLoading = false;
      state.isLoaded = false;
    },
    ADD_COLUMN(state, column) {
      state.columns = [...state.columns, column];
    },
    ADD_ISSUE(state, issue) {
      const column = state.columns
        .find(v => v.id === issue.columnId) || state.columns[0];
      const index = column.issues.findIndex(v => v.position > issue.position);
      column.issues.splice(index, 0, issue);
      // if (index === -1) {
      //   column.issues.unshift(issue);
      // } else {
      //   column.issues.splice(index, 0, issue);
      // }
      console.log(index);
      // column.issues.splice(index, 0, issue);
      // column.issues.push(issue);
    },
    UPDATE_BOARD_ISSUE(state, { issue, key, value }) {
      issue[key] = value;
    },
    SET_CURRENT_ISSUE(state, issue) {
      state.currentIssue = issue;
    },
    UPDATE_BOARD(state, { name }) {
      state.name = name;
    }
  }
};
