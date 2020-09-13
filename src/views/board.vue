<template>
  <TopMenu />

  <div class='board'>
    <div class='columns'>
      <div
        v-for='column in sortedColumns'
        :key='column.id'
        class='column'
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

      // columns
      // @drop='drop($event)'
      // @dragover.prevent
      // @dragenter.prevent

      // @dragenter='dragEnter($event)'
      // @dragover='dragOver($event)'

export default {
  name: 'Board',
  components: {
    TopMenu,
    ColumnNew
  },
  data: () => ({
    isSubmittingNewColumn: false,
    columns: [
      { id: 1, name: 'Column 1', position: 1 },
      { id: 2, name: 'Column 2', position: 2 },
      { id: 3, name: 'Column 3', position: 3 },
      { id: 4, name: 'Column 4', position: 4 }
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
    dragStart(ev, column) {
      // ev.dataTransfer.effectAllowed = 'move';
      // ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
      // ev.dataTransfer.setDragImage(ev.target,0,0);
      console.log('dragStart: ' + column?.id);
      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.effectAllowed = 'move'
      ev.dataTransfer.setData('itemID', column.id)
    },
    dragEnter(ev, column) {
      console.log('dragEnter');
      // console.log(ev.dataTransfer.getData('itemID'));
      console.log('to: ' + column?.id);

      ev.preventDefault();
      return true;
    },
    dragLeave(ev, column) {
      console.log('dragLeave');
      // console.log(ev.dataTransfer.getData('itemID'));
      console.log('from :' + column?.id);

      ev.preventDefault();
      return true;
    },
    // dragDrop(ev) {
    //   var src = ev.dataTransfer.getData("Text");
    //   ev.target.appendChild(document.getElementById(src));
    //   ev.stopPropagation();
    //   return false;
    // },
    drop (ev, column) {
      console.log('drop :' + ev.dataTransfer.getData('itemID'));
      console.log('to: ' + column.id);
      const columnMoved = this.columns.find(v => v.id == ev.dataTransfer.getData('itemID'));
      if (columnMoved != null) {
        const fromRightToLeft = columnMoved.position < column.position;
        const columnsWoMoved = this.columns.filter(v => v.id != columnMoved.id);
        const columnsBefore = fromRightToLeft ?
          columnsWoMoved.filter(v => v.position <= column.position) :
          columnsWoMoved.filter(v => v.position < column.position);
        console.log(columnsBefore.map(v => v.name));

        const columnsAfter = fromRightToLeft ?
          columnsWoMoved.filter(v => v.position > column.position) :
          columnsWoMoved.filter(v => v.position >= column.position);
        console.log(columnsAfter.map(v => v.name));

        const newColumns = [...columnsBefore, columnMoved, ...columnsAfter];
        newColumns.map((v, i) => v.position = i + 1);
        console.log(newColumns.map(v => v.name));
        this.columns = newColumns;
      }
      ev.stopPropagation();
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
</style>
