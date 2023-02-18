import api from '@/api';

export default {
  namespaced: true,

  state: {
    id: undefined,
    name: undefined,
    isOwner: undefined,
    cacheKey: undefined,
    columns: [],
    repositories: [],
    isLoading: true,
    isLoaded: false,
    currentIssue: {},
    dragenterColumnId: undefined,
    loadedAt: undefined,
  },

  getters: {
    token: (state, getters, rootState, rootGetters) => (
      rootGetters['user/token']
    ),
    username: (state, getters, rootState, rootGetters) => (
      rootGetters['user/username']
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

    async silentFetch({ commit, getters }, { id }) {
      const board = await api.fetchBoard(
        getters.token,
        { id }
      );
      if (board != null) {
        commit('FINISH_LOADING', board);
      }
    },

    async fetchBoardCacheKey({ getters }, { id }) {
      return await api.fetchBoardCacheKey(
        getters.token,
        { id }
      );
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

    async moveColumn({ commit, getters, state }, { fromColumnIndex, toColumnIndex }) {
      if (fromColumnIndex === toColumnIndex) { return; }

      const columns = state.columns
      const columnToMove = columns.splice(fromColumnIndex, 1)[0]
      columns.splice(toColumnIndex, 0, columnToMove)
      columns.map((v, index) => v.position = index);
      const result = await api.updateColumnPositions(
        getters.token,
        { boardId: state.id, columns }
      );
      commit('DRAGENTER_OVER');
      if (result?.errors?.length == 0) {
        console.log('success');
      } else {
        console.error(result.errors[0]);
      }
    },

    async moveIssue(
      { commit, getters, state, dispatch },
      { fromColumnIndex, toColumnIndex, fromIssueIndex, toIssueIndex, isColumnTop }
    ) {
      if (fromColumnIndex === undefined) { return; }
      if (toColumnIndex === undefined) { return; }
      if (fromIssueIndex === undefined) { return; }
      if (toIssueIndex === undefined) {
        // При перености тикета так, что позиция не определена. Например, когда
        // тикет "просается" в заголовок колонки, не задевая ни одного тикета.
        // Однозначно, куда был перемещен тикет по данным параметрам
        // не представляется возмоным. Есть только 2а варианта:
        // 1) Пример ниже для перемещения в самый низ.
        // toIssueIndex = state.columns[toColumnIndex].issues.length + 1;
        // 2) Пример ниже для перемещения в самый верх.
        // toIssueIndex = 0;
        if (isColumnTop) {
          toIssueIndex = 0;
        } else {
          toIssueIndex = state.columns[toColumnIndex].issues.length + 1;
        }
      }

      const fromIssues = state.columns[fromColumnIndex].issues;
      const toIssues = state.columns[toColumnIndex].issues;

      const issueToMove = fromIssues.splice(fromIssueIndex, 1)[0];
      toIssues.splice(toIssueIndex, 0, issueToMove);
      const toColumn = state.columns[toColumnIndex];
      commit('DRAGENTER_OVER');
      if (fromColumnIndex !== toColumnIndex && toColumn.isAutoClose && !issueToMove.isClosed) {
        dispatch(
          'board/updateIssueState',
          {
            id: issueToMove.id,
            columnId: state.columns[toColumnIndex].id,
            isClosed: true
          }, {
            root: true
          }
        );
      }
      if (fromColumnIndex !== toColumnIndex && toColumn.isAutoAssign && issueToMove.assignees.length === 0) {
        const login = getters.username;
        dispatch(
          'board/updateIssue',
          {
            id: issueToMove.id,
            columnId: state.columns[toColumnIndex].id,
            assignees: [{ login }]
          }, {
            root: true
          }
        );
      }
      commit('TOUCH_LOADED_AT');
      await api.moveIssues(
        getters.token,
        {
          boardId: state.id,
          columnId: state.columns[toColumnIndex].id,
          issueIds: toIssues.map(v => v.id)
        }
      );
    },

    dragenter({ commit, state }, { columnIndex }) {
      const column = state.columns[columnIndex];
      if (column == null) { return; }
      commit('DRAGENTER', column.id);
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
        dispatch('updateBoardIssue', { ...result.issue, columnId });
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

    // TODO: Remove
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

      // Testing hotfix for drag & drop - проблема в том, что просто фильтравать
      // на доске архивированные issue нельзя, т.к. не успевает обновиться
      // индексация issue и после этого issueIndex берется не тот, поэтому
      // удаляют issue полностью из списка. Если поможет, что нужно удалить
      // фильтрацию архивных issue (см. notArchivedIssues в column.vue).
      // А так же починить #22 т.к. теперь это еще более актуально.
      if (issue.isArchived) {
        const index = column.issues.findIndex(v => v.id === issue.id);
        column.issues.splice(index, 1);
        return;
      }

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

    async updateBoardColumn({ getters, state }, { id, name, isAutoAssign, isAutoClose }) {
      const column = state.columns.find(v => v.id === id);
      if (column == null) { return; }

      const result = await api.updateColumn(
        getters.token,
        { id, name, boardId: state.id, isAutoAssign, isAutoClose }
      );
      if (result.errors.length === 0) {
        column.name = name;
        column.isAutoAssign = isAutoAssign;
        column.isAutoClose = isAutoClose;
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
      const { id, name, columns, repositories, isOwner, cacheKey } = board;
      state.id = id;
      state.name = name;
      state.isOwner = isOwner;
      state.cacheKey = cacheKey;
      state.columns = columns;
      state.repositories = repositories;
      state.isLoading = false;
      state.isLoaded = true;
      state.loadedAt = new Date();
    },
    NOT_FOUND(state) {
      state.isLoading = false;
      state.isLoaded = false;
    },
    ADD_COLUMN(state, column) {
      state.columns.push(column);
    },
    ADD_ISSUE(state, issue) {
      const column = state.columns
        .find(v => v.id === issue.columnId) || state.columns[0];
      const index = column.issues.findIndex(v => v.position >= issue.position);
      if (index === -1) {
        column.issues.push(issue);
      } else {
        column.issues.splice(index, 0, issue);
      }
    },
    UPDATE_BOARD_ISSUE(state, { issue, key, value }) {
      issue[key] = value;
    },
    SET_CURRENT_ISSUE(state, issue) {
      state.currentIssue = issue;
    },
    UPDATE_BOARD(state, { name }) {
      state.name = name;
    },
    DRAGENTER_OVER(state) {
      state.dragenterColumnId = undefined;
    },
    DRAGENTER(state, columnId) {
      state.dragenterColumnId = columnId;
    },
    TOUCH_LOADED_AT(state) {
      state.loadedAt = new Date();
    },
  }
};
