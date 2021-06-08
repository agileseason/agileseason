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
    moveColumnIssue: call('board/moveIssue'),
    // TODO: Rename
    moveTaskOrColumn (transferData) {
      if (transferData.type === 'column') {
        this.moveColumn(transferData)
      } else {
        this.moveTask(transferData)
      }
    },
    // TODO: Rename
    moveTask ({ fromColumnIndex, fromTaskIndex }) {
      // console.log('moveTask');
      // console.log({
      //   fromColumnIndex,
      //   toColumnIndex: this.columnIndex,
      //   fromIssueIndex: fromTaskIndex,
      //   toIssueIndex: this.taskIndex
      // });
      this.moveColumnIssue({
        fromColumnIndex,
        toColumnIndex: this.columnIndex,
        fromIssueIndex: fromTaskIndex,
        toIssueIndex: this.taskIndex
      });
    },
    moveColumn ({ fromColumnIndex }) {
      this.moveBoardColumn({
        fromColumnIndex,
        toColumnIndex: this.columnIndex
      });
    }
  }
}
