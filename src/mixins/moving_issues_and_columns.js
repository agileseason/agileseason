export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
    board: {
      type: Object,
      required: true
    }
  },
  methods: {
    moveTaskOrColumn (transferData) {
      if (transferData.type === 'column') {
        this.moveColumn(transferData)
      } else {
        this.moveTask(transferData)
      }
    },
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
    },
    moveColumn ({ fromColumnIndex }) {
      console.log('moveColumn:');
      console.log(fromColumnIndex);
      // this.$store.commit('MOVE_COLUMN', {
      //   fromColumnIndex,
      //   toColumnIndex: this.columnIndex
      // })
    }
  }
}
