<template>
  <TopMenu />

  <div class='board'>
    <div v-if='isLoading'>Loading...</div>
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
      />
      <ColumnNew @submit='createNewColumn' />
    </div>
  </div>
</template>

<script>
import Column from '@/components/board/column.vue';
import ColumnNew from '@/components/board/column_new.vue';
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
    TopMenu,
    Column,
    ColumnNew
  },
  data: () => ({
    isSubmittingNewColumn: false,
  }),
  computed: {
    token: get('user/token'),
    isLoading: get('board/isLoading'),
    isLoaded: get('board/isLoaded'),
    isNotFound: get('board/isNotFound'),
    columns: get('board/columns'),
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    },
    boardId() { return parseInt(this.$route.params.id) || 0; }
  },
  async created() {
    await this.fetchProfileLazy();
    await this.fetch({ id: this.boardId });
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'board/fetch',
      'board/createColumn',
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

      const columnMoved = this.columns.find(v => v.id == e.dataTransfer.getData('itemID'));
      if (columnMoved != null) {
        if (e.dataTransfer.getData('itemKind') === 'column') {
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
        } else {
          console.log('todo: issue');
        }
      }
      e.stopPropagation();
    },
    dragEnd(e, column) {
      column.isDragStart = false;
      e.preventDefault();
      return true;
    },
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px
</style>
