<template>
  <AppDrop
    class='issue-wrapper'
    @drop='moveIssueOrColumn'
    @dragenter='dragenter'
    :transferData="{ type: 'issue', enterColumnIndex: columnIndex }"
  >
    <AppDrag
      class='issue'
      :class="{ 'read-only': isReadOnly }"
      :style='colorStyles'
      :transferData="{
        type: 'issue',
        fromColumnIndex: columnIndex,
        fromIssueIndex: issueIndex
      }"
      :is-read-only='isReadOnly'
      @click='goToIssue'
    >
      <div class='title'>{{ title }}</div>
      <span v-if='isReadOnly' class='url'>
        <span class='number'>#{{ number }}</span>
        {{ repositoryName }}
      </span>
      <a v-else :href='url' class='url' @click.stop='click'>
        <span class='number'>#{{ number }}</span>
        {{ repositoryName }}
      </a>
      <div v-if='isLabels' class='labels'>
        <Label
          v-for='(label, $index) in labels'
          :label='label'
          :key='$index'
        />
      </div>

      <div v-if='isAssignedOrExtra' class='assigned-or-extra'>
        <div class='extras-and-actions'>
          <div class='extras'>
            <div v-if='isBody' class='extra-item body-present' />
            <div v-if='commentsCount > 0' class='extra-item comments-count'>
              {{ commentsCount }}
            </div>
          </div>

          <div v-if='isActionVisible' class='actions'>
            <span v-if='isClosed' class='closed'>Closed</span>
            <FastButton
              v-if='!isClosed'
              name='Close'
              icon='close'
              @click.stop='close'
              :is-submitting='isCloseSubmitting'
            />
            <FastButton
              v-if='isClosed'
              name='Archive'
              icon='archive'
              @click.stop='archive'
              :is-submitting='isArchiveSubmitting'
            />
          </div>
        </div>

        <div class='assigned'>
          <img
            v-for='(assignee, $index) in sortedAssignees'
            :key='$index'
            class='assignee'
            :src='assignee.avatarUrl'
            :title='assignee.login'
          />
        </div>
      </div>
      <div v-if='totalSubtasks > 0' class='progress-container'>
        <Progress :total='totalSubtasks' :done='doneSubtasks' />
      </div>
    </AppDrag>
  </AppDrop>
</template>

<script>
import AppDrag from '@/components/app_drag';
import AppDrop from '@/components/app_drop';
import Label from '@/components/board/label';
import Progress from '@/components/board/issues/progress';
import FastButton from '@/components/board/issues/fast_button';
import movingIssuesAndColumns from '@/mixins/moving_issues_and_columns';
import { call } from 'vuex-pathify';

export default {
  name: 'Issue',
  components: {
    AppDrag,
    AppDrop,
    Label,
    FastButton,
    Progress
  },
  props: {
    id: { type: Number, required: true },
    issueIndex: { type: Number, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    repositoryName: { type: String, required: true },
    labels: { type: Array, required: true },
    assignees: { type: Array, required: true },
    isClosed: { type: Boolean, required: true },
    isBody: { type: Boolean, required: true },
    commentsCount: { type: Number, required: true },
    color: { type: String, required: false, default: null },
    columnId: { type: Number, required: true },
    totalSubtasks: { type: Number, required: true },
    doneSubtasks: { type: Number, required: true },
    isLastColumn: { type: Boolean, default: false },
    isReadOnly: { type: Boolean, default: false }
  },
  mixins: [movingIssuesAndColumns],
  data: () => ({
    isCloseSubmitting: false,
    isArchiveSubmitting: false
  }),
  computed: {
    isLabels() { return this.labels.length > 0; },
    isActionVisible() {
      if (this.isReadOnly) { return false; }
      return this.isClosed || this.isLastColumn;
    },
    isAssignedOrExtra() {
      return this.isBody ||
        this.isActionVisible ||
        this.assignees.length > 0 ||
        this.commentsCount > 0;
    },
    colorStyles() {
      if (this.color == null) { return; }
      if (this.color == 'ffffff') { return; }

      return `background-color: #${this.color}`;
    },
    sortedAssignees() {
      return [...this.assignees].sort((a, b) => (a.login > b.login) ? 1 : -1);
    }
  },
  methods: {
    ...call([
      'board/setCurrentIssue',
      'board/updateIssueState'
    ]),
    goToIssue() {
      if (this.isReadOnly) { return; }

      this.setCurrentIssue({ issue: this });
      this.$router.push({
        name: 'issue',
        params: { issueId: this.id, issueNumber: this.number }
      });
    },
    async close() {
      if (this.isCloseSubmitting) { return; }

      this.isCloseSubmitting = true;
      await this.updateIssueState({
        id: this.id,
        columnId: this.columnId,
        isClosed: true
      });
      this.isCloseSubmitting = false;
    },
    async archive() {
      if (this.isArchiveSubmitting) { return; }

      this.isArchiveSubmitting = true;
      await this.updateIssueState({
        id: this.id,
        columnId: this.columnId,
        isArchived: true
      });
      this.isArchiveSubmitting = false;
    }
  }
}
</script>

<style scoped lang='sass'>
.issue-wrapper
  padding-bottom: 8px

.issue
  background-color: #fff
  border-radius: 4px
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12)
  overflow: hidden
  padding: 8px

  &:not(.read-only)
    cursor: pointer

  .title
    color: #212121
    font-size: 15px
    font-weight: 500
    line-height: 18px
    word-break: break-word

  .url
    color: #757575
    display: inline-block
    margin-top: 4px

    .number
      color: #616161
      font-weight: 500

  a.url
    &:hover
      color: #616161

  .assigned-or-extra
    display: flex
    justify-content: space-between
    align-items: flex-end

    .extras-and-actions
      .extras
        display: flex

        .extra-item
          background-position: center 3px
          background-repeat: no-repeat
          background-size: initial
          border-radius: 4px
          height: 18px
          margin-right: 2px
          margin-top: 6px

          &.body-present
            background-image: url('../../assets/icons/issue/grey_book.svg')
            width: 16px

          &.comments-count
            background-image: url('../../assets/icons/issue/grey_comment.svg')
            background-position: 4px 3px
            color: #455a64
            font-size: 10px
            font-weight: 600
            padding: 0 3px 0 21px
            line-height: 18px

      .actions
        display: flex
        margin-top: 8px

        .closed
          background-color: #ffcdd2
          border-radius: 4px
          color: #d73a49
          display: inline-block
          font-size: 11px
          font-weight: 400
          height: 22px
          letter-spacing: 0.2px
          line-height: 23px
          margin-right: 4px
          padding: 0 7px 0 25px
          position: relative

          &:before
            background-image: url('../../assets/icons/issue/red_closed.svg')
            background-position: center
            background-repeat: no-repeat
            content: ''
            display: inline-block
            height: 16px
            left: 5px
            position: absolute
            top: 3px
            width: 16px

    .assigned
      text-align: right
      width: 130px

      .assignee
        display: inline-block
        vertical-align: bottom
        border-radius: 11px
        height: 22px
        margin: 2px 0 0 4px
        width: 22px

  .progress-container
    margin: 6px -10px -8px -10px
</style>
