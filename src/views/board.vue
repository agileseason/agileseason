<template>
  <TopMenu />

  <div class='board'>
    <Loader v-if='isLoading' :title='boardName' />
    <div v-if='isNotFound'>Not Found!</div>
    <div v-if='isLoaded' class='columns'>
      <Column
        v-for='column in sortedColumns'
        :key='column.id'
        v-bind='column'
        :class='{
          "is-drag-enter": column.isDragEnter,
          "is-drag-start": column.isDragStart
        }'
        draggable='true'
        @dragstart='dragStart($event, column)'
        @dragenter='dragEnter($event, column)'
        @dragleave='dragLeave($event, column)'
        @dragend='dragEnd($event, column)'
        @dragover.prevent
        @drop='drop($event, column)'
        @open='open'
      />
      <ColumnNew @submit='createNewColumn' />
    </div>
  </div>

  <div class='modal-backdrop' @click='close' v-if='isExpanded' />
  <transition name='slide' :duration='200'>
    <IssueShow
      v-show='isExpanded'
      class='modal'
      :class='{ "is-expanded": isExpanded }'
      :issue='currentIssue'
      @close='close'
    />
  </transition>
</template>

<script>
import Column from '@/components/board/column.vue';
import ColumnNew from '@/components/board/column_new.vue';
import IssueShow from '@/components/board/issue_show.vue';
import Loader from '@/components/loader';
import TopMenu from '@/components/menu/top.vue';
import { get, call } from 'vuex-pathify';

// https://www.tutorialspoint.com/html5/html5_drag_drop.htm
// 1. dragstart
// 2. dragenter
// 3. dragover
// 4. dragleave
// 5. drag
// 6. drop
// 7. dragend

export default {
  name: 'Board',
  components: {
    Column,
    ColumnNew,
    IssueShow,
    Loader,
    TopMenu
  },
  data: () => ({
    isSubmittingNewColumn: false,
    isExpanded: false,
    currentIssue: null
  }),
  computed: {
    token: get('user/token'),
    boards: get('user/boards'),
    columns: get('board/columns'),
    isLoaded: get('board/isLoaded'),
    isLoading: get('board/isLoading'),
    isNotFound: get('board/isNotFound'),
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    },
    boardId() { return parseInt(this.$route.params.id) || 0; },
    boardName() {
      return this.boards.find(v => v.id === this.boardId)?.name || 'Board';
    }
  },
  async created() {
    await this.fetchProfileLazy();
    await this.fetch({ id: this.boardId });
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'board/createColumn',
      'board/fetch',
      'board/removeIssue',
      'board/updateColumnPositions'
    ]),
    async createNewColumn(name) {
      if (this.isSubmittingNewColumn) { return; }
      this.isSubmittingNewColumn = true;
      await this.createColumn({ name });
      this.isSubmittingNewColumn = false;
    },
    dragStart(e, column) {
      console.log('[dragStart] Column: ' + column?.id);
      // console.log(e.target.className);
      if (e.target.className === 'column') {
        column.isDragStart = true;
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('itemKind', 'column');
        e.dataTransfer.setData('itemID', column.id);
      } else {
        console.log('[dragStart] Column: prevent');
      }
    },
    dragEnter(e, column) {
      column.isDragEnter = true;
      // console.log('[dragEnter] Column: ' + e.target.className);
      // console.log('to: ' + column?.id);

      e.preventDefault();
      return true;
    },
    dragLeave(e, column) {
      column.isDragEnter = false;
      // console.log('[dragLeave]');
      // console.log('from :' + column?.id);

      e.preventDefault();
      return true;
    },
    drop (e, column) {
      column.isDragEnter = false;
      console.log('[drop] ID:' + e.dataTransfer.getData('itemID'));
      console.log('[drop] Kind: ' + e.dataTransfer.getData('itemKind'));
      console.log('[drop] Column ID: ' + column?.id);

      if (e.dataTransfer.getData('itemKind') === 'column') {
        const columnMoved = this.columns
          .find(v => v.id == e.dataTransfer.getData('itemID'));

        if (columnMoved != null) {
          const fromRightToLeft = columnMoved.position < column.position;
          const columnsWoMoved = this.columns.filter(v => v.id != columnMoved.id);
          const columnsBefore = fromRightToLeft ?
            columnsWoMoved.filter(v => v.position <= column.position) :
            columnsWoMoved.filter(v => v.position < column.position);
          // console.log(columnsBefore.map(v => v.name));

          const columnsAfter = fromRightToLeft ?
            columnsWoMoved.filter(v => v.position > column.position) :
            columnsWoMoved.filter(v => v.position >= column.position);
          // console.log(columnsAfter.map(v => v.name));

          const newColumns = [...columnsBefore, columnMoved, ...columnsAfter];
          newColumns.map((v, i) => v.position = i + 1);
          // console.log(newColumns.map(v => v.name));
          // Note: Can't write a computed prop (readonly).
          // this.columns = newColumns;
          this.updateColumnPositions({ columns: this.columns });
        }
      } else {
        this.removeIssue({
          issueId: e.dataTransfer.getData('itemID'),
          columnToId: column.id
        });
      }
      e.stopPropagation();
    },
    dragEnd(e, column) {
      column.isDragStart = false;
      e.preventDefault();
      return true;
    },
    open({ id, number, title, url, repositoryName }) {
      this.isExpanded = true;
      this.currentIssue = { id, number, title, url, repositoryName };
      console.log('true ' + id);
    },
    close() {
      this.isExpanded = false;
      console.log('false');
    }
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px

.modal
  background-color: #fff
  height: 500px
  position: absolute
  top: 36px
  left: 10% // 100% - 80%(width)/2
  width: 80%
  z-index: 5
  box-shadow: 0px 6px 10px 0px #BDBDBD

  transform: translateY(2000px)

  &.slide-enter-to
    transform: translateY(0%)

  &.is-expanded:not(.slide-enter-active)
    transform: none

.slide-enter-active,
.slide-leave-active
  transition: transform 200ms

.modal-backdrop
  background: rgba(0, 0, 0, 0.3)
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 4
</style>
