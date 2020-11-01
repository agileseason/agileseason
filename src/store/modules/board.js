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
    }
  }
};
