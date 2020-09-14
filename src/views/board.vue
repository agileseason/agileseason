<template>
  <TopMenu />

  <div class='board'>
    <div v-if='isLoading'>Loading...</div>
    <div v-if='isNotFound'>Not Found!</div>
    <div v-if='isLoaded' class='columns'>
      <div
        v-for='column in sortedColumns'
        :key='column.id'
        class='column'
        :class='{ "is-drag-enter": column.isDragEnter }'
        draggable='true'
        @dragstart='dragStart($event, column)'
        @dragenter='dragEnter($event, column)'
        @dragleave='dragLeave($event, column)'
        @dragover.prevent
        @drop='drop($event, column)'
      >
        {{ column.name }} / {{ column.position }}
      </div>
      <ColumnNew @submit='createNewColumn' />
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/menu/top.vue';
import ColumnNew from '@/components/board/column_new.vue';
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
      'board/createColumn'
    ]),
    async createNewColumn(name) {
      if (this.isSubmittingNewColumn) { return; }
      this.isSubmittingNewColumn = true;
      await this.createColumn({ name });
      this.isSubmittingNewColumn = false;

      // await this.$nextTick(() => this.isSubmittingNewColumn = false);
      // console.log('new column: ' + name);
    },
    dragStart(e, column) {
      console.log('dragStart: ' + column?.id);
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('itemID', column.id)
    },
    dragEnter(e, column) {
      column.isDragEnter = true;
      // console.log('dragEnter');
      // console.log('to: ' + column?.id);

      e.preventDefault();
      return true;
    },
    dragLeave(e, column) {
      column.isDragEnter = false;
      // console.log('dragLeave');
      // console.log('from :' + column?.id);

      e.preventDefault();
      return true;
    },
    drop (e, column) {
      // console.log('drop :' + e.dataTransfer.getData('itemID'));
      // console.log('to: ' + column.id);
      column.isDragEnter = false;
      const columnMoved = this.columns.find(v => v.id == e.dataTransfer.getData('itemID'));
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
        this.columns = newColumns;
      }
      e.stopPropagation();
    }
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px

  .columns
    .column
      display: inline-block
      width: 270px
      height: 200px
      vertical-align: top
      background-color: #888
      margin-right: 8px

      &.is-drag-enter
        background-color: #aaa
</style>
