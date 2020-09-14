<template>
  <TopMenu />

  <div class='board'>
    <div class='columns'>
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
    columns: [
      { id: 1, name: 'Column 1', position: 1, isDragEnter: false },
      { id: 2, name: 'Column 2', position: 2, isDragEnter: false },
      { id: 3, name: 'Column 3', position: 3, isDragEnter: false },
      { id: 4, name: 'Column 4', position: 4, isDragEnter: false }
    ]
  }),
  computed: {
    token: get('user/token'),
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    }
  },
  async created() {
    await this.fetchProfileLazy();
  },
  methods: {
    ...call([
      'user/fetchProfileLazy'
    ]),
    async createNewColumn(name) {
      if (this.isSubmittingNewColumn) { return; }
      this.isSubmittingNewColumn = true;
      await this.$nextTick(() => this.isSubmittingNewColumn = false);
      console.log('new column: ' + name);
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
