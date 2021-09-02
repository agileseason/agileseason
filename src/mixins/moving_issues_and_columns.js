import { call } from 'vuex-pathify';

export default {
  props: {
    columnIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    moveBoardColumn: call('board/moveColumn'),
    moveColumnIssue: call('board/moveIssue'),
    dragenterColumn: call('board/dragenter'),
    moveIssueOrColumn(transferData) {
      if (transferData.type === 'column') {
        this.moveColumn(transferData)
      } else {
        this.moveIssue(transferData)
      }
    },
    moveIssue({ fromColumnIndex, fromIssueIndex }) {
      this.moveColumnIssue({
        fromColumnIndex,
        toColumnIndex: this.columnIndex,
        fromIssueIndex: fromIssueIndex,
        toIssueIndex: this.issueIndex
      });
    },
    moveColumn({ fromColumnIndex }) {
      this.moveBoardColumn({
        fromColumnIndex,
        toColumnIndex: this.columnIndex
      });
    },
    dragenter({ enterColumnIndex }) {
      if (enterColumnIndex != null) {
        this.dragenterColumn({ columnIndex: enterColumnIndex });
      }
    }
  }
}
