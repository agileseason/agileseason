<template>
  <TopMenu />

  <div class='board'>
    <Loader v-if='isLoading' :title='boardName' />
    <div v-if='isNotFound'>Not Found!</div>
    <div v-if='isLoaded' class='columns' :style='widthStyles'>
      <!--Column
        v-for='(column, $index) in sortedColumns'
        :key='column.id'
        v-bind='column'
        :class='{
          "is-drag-enter": column.isDragEnter,
          "is-drag-start": column.isDragStart
        }'
        :is-last-column='$index === columns.length - 1'
        draggable='true'
        @dragstart='dragStart($event, column)'
        @dragenter='dragEnter($event, column)'
        @dragleave='dragLeave($event, column)'
        @dragend='dragEnd($event, column)'
        @dragover.prevent
        @drop='drop($event, column)'
      /-->
      <Column
        v-for='(column, $index) in sortedColumns'
        :key='column.id'
        v-bind='column'
        :column-index='$index'
        :is-last-column='$index === columns.length - 1'
      />
      <ColumnNew v-if='isOwner' @submit='createNewColumn' />
    </div>
  </div>

  <div
    class='modal-overlay'
    v-if='isLoaded'
    v-show='isModalOpen'
    @click.self='backToBoard'
  >

    <router-view v-slot='{ Component }'>
      <transition name='slide' :duration='200'>
        <component :is='Component' />
      </transition>
    </router-view>
  </div>
</template>

<script>
import Column from '@/components/board/column.vue';
import ColumnNew from '@/components/board/column_new.vue';
import IssueNew from '@/components/board/issue_new.vue';
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
    IssueNew,
    Loader,
    TopMenu
  },
  data: () => ({
    isSubmittingNewColumn: false
  }),
  computed: {
    token: get('user/token'),
    boards: get('user/boards'),
    columns: get('board/columns'),
    isOwner: get('board/isOwner'),
    isLoaded: get('board/isLoaded'),
    isLoading: get('board/isLoading'),
    isNotFound: get('board/isNotFound'),
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    },
    boardId() { return parseInt(this.$route.params.id) || 0; },
    boardName() {
      return this.boards.find(v => v.id === this.boardId)?.name || 'Board';
    },
    widthStyles() {
      return this.isLoaded ? { 'min-width': `${280 * (this.columns.length + 1)}px` } : {};
    },
    isModalOpen() {
      return this.$route.name === 'issue' || this.$route.name === 'issue_new';
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
      'board/removeIssue'
    ]),
    async createNewColumn(name) {
      if (this.isSubmittingNewColumn) { return; }
      this.isSubmittingNewColumn = true;
      await this.createColumn({ name });
      this.isSubmittingNewColumn = false;
    },
    dragStart(e, column) {
      // console.log('[dragStart] Column: ' + column?.id);
      // console.log(e);
      if (e.target.className === 'column') {
        column.isDragStart = true;
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('itemKind', 'column');
        e.dataTransfer.setData('itemID', column.id);
      } else {
        // column.isDragStart = false;
        console.log('[dragStart] Column: prevent');
      }
    },
    dragEnter(e, column) {
      // console.log(e);
      column.isDragEnter = true;
      // console.log('[dragEnter] Column: ' + e.target.className);
      // console.log('to: ' + column?.id);

      e.preventDefault();
      return true;
    },
    dragLeave(e, column) {
      // if (e.path.every(v => v.className !== 'column is-drag-enter')) {
      //   column.isDragEnter = false;
      //   // console.log('[dragLeave]');
      //   // console.log('from :' + column?.id);
      //   // console.log(e.path);
      // }
      column.isDragEnter = false;

      e.preventDefault();
      return true;
    },

    // TODO: Remove
    // drop (e, column) {
    //   column.isDragEnter = false;
    //   console.log('[drop] ID:' + e.dataTransfer.getData('itemID'));
    //   console.log('[drop] Kind: ' + e.dataTransfer.getData('itemKind'));
    //   console.log('[drop] Column ID: ' + column?.id);
    //   if (e.dataTransfer.getData('itemKind') === 'column') {
    //     const columnMoved = this.columns
    //       .find(v => v.id == e.dataTransfer.getData('itemID'));
    //     if (columnMoved != null) {
    //       const fromRightToLeft = columnMoved.position < column.position;
    //       const columnsWoMoved = this.columns.filter(v => v.id != columnMoved.id);
    //       const columnsBefore = fromRightToLeft ?
    //         columnsWoMoved.filter(v => v.position <= column.position) :
    //         columnsWoMoved.filter(v => v.position < column.position);
    //       // console.log(columnsBefore.map(v => v.name));
    //       const columnsAfter = fromRightToLeft ?
    //         columnsWoMoved.filter(v => v.position > column.position) :
    //         columnsWoMoved.filter(v => v.position >= column.position);
    //       // console.log(columnsAfter.map(v => v.name));
    //       const newColumns = [...columnsBefore, columnMoved, ...columnsAfter];
    //       newColumns.map((v, i) => v.position = i + 1);
    //       // console.log(newColumns.map(v => v.name));
    //       // Note: Can't write a computed prop (readonly).
    //       // this.columns = newColumns;
    //       this.updateColumnPositions({ columns: this.columns });
    //     }
    //   } else {
    //     this.removeIssue({
    //       issueId: e.dataTransfer.getData('itemID'),
    //       columnToId: column.id
    //     });
    //   }
    //   e.stopPropagation();
    // },

    dragEnd(e, column) {
      column.isDragStart = false;
      e.preventDefault();
      return true;
    },
    backToBoard() {
      this.$router.push({ name: 'board', id: this.boardId });
    }
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px
  overflow-x: scroll
</style>
