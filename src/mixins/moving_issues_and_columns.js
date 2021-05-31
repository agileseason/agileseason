import { call } from 'vuex-pathify';

export default {
  props: {
    // column: {
    //   type: Object,
    //   required: true
    // },
    columnIndex: {
      type: Number,
      required: true
    },
    // board: {
    //   type: Object,
    //   required: true
    // }
  },
  methods: {
    moveBoardColumn: call('board/moveColumn'),
    // TODO: Rename
    moveTaskOrColumn (transferData) {
      console.log('moveTaskOrColumn:');
      console.log(transferData);
      console.log('----------------------');
      if (transferData.type === 'column') {
        this.moveColumn(transferData)
      } else {
        this.moveTask(transferData)
      }
    },
    // TODO: Rename
    moveTask ({ fromColumnIndex, fromTaskIndex }) {
      // const fromTasks = this.board.columns[fromColumnIndex].tasks
      // this.$store.commit('MOVE_TASK', {
      //   fromTasks,
      //   fromTaskIndex,
      //   toTasks: this.column.tasks,
      //   toTaskIndex: this.taskIndex
      // })
      console.log('moveIssue:');
      console.log('fromColumnIndex - ' + fromColumnIndex);
      console.log('fromTaskIndex - ' + fromTaskIndex);
      console.log('----------------------');
    },
    moveColumn ({ fromColumnIndex }) {
      console.log('moveColumn:');
      console.log(fromColumnIndex);
      console.log(this.columnIndex);
      console.log('----------------------');
      this.moveBoardColumn({
        fromColumnIndex,
        toColumnIndex: this.columnIndex
      });
      // this.$store.commit('MOVE_COLUMN', {
      //   fromColumnIndex,
      //   toColumnIndex: this.columnIndex
      // })
    }
  }
}
