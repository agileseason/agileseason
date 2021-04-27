import api from '@/api';

export default {
  namespaced: true,

  state: {
    id: undefined,
    name: undefined,
    columns: [],
    repositories: [],
    isLoading: true,
    isLoaded: false
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    isNotFound: (state) => (!state.isLoading && !state.isLoaded)
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

    async createIssue({ commit, state, getters }, { columnId, repositoryId, title, body, position }) {
      const result = await api.createIssue(
        getters.token,
        { boardId: state.id, columnId, repositoryId, title, body, position }
      );
      if (result?.issue == null) {
        // todo: Show errors (result.errors).
      } else {
        commit('ADD_ISSUE', result.issue);
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
          console.error(result.errors[0]);
        }
      }
    },

    // setCurrentIssue({ commit }, { issue }) {
    //   // { id, number, title, url, repositoryName, isClosed }
    //   commit('SET_CURRENT_ISSUE', issue);
    // },

    updateBoardIssue({ commit, state }, issue) {
      // console.log('search issue');
      // console.log(issue);
      const column = state.columns.find(v => v.id === issue.columnId);
      if (column == null) { return; }

      const boardIssue = column.issues.find(v => v.id === issue.id);
      if (boardIssue == null) { return; }

      // console.log(boardIssue);
      // commit(
      //   'UPDATE_BOARD_ISSUE',
      //   { issue: boardIssue, key: 'title', value: issue.title }
      // );
      Object.keys(issue).forEach(prop => {
        commit(
          'UPDATE_BOARD_ISSUE',
          { issue: boardIssue, key: prop, value: issue[prop] }
        );
      });
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, board) {
      const { id, name, columns, repositories } = board;
      state.id = id;
      state.name = name;
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
    }
  }
};
