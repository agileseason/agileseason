<template>
  <div class='issue' @click='goToIssue' :style='colorStyles'>
    <div class='title'>{{ title }}</div>
    <a :href='url' class='url' @click.stop='click'>
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
            :is-submitting='isSubmitting'
          />
          <FastButton
            v-if='isClosed'
            name='Archive'
            icon='archive'
            @click.stop='archive'
          />
        </div>
      </div>

      <div class='assigned'>
        <img
          v-for='(assignee, $index) in assignees'
          :key='$index'
          class='assignee'
          :src='assignee.avatarUrl'
          :title='assignee.login'
        />
      </div>
    </div>
  </div>
</template>

<script>
import Label from '@/components/board/label'
import FastButton from '@/components/board/issues/fast_button'
import { call } from 'vuex-pathify';

export default {
  name: 'Issue',
  components: {
    Label,
    FastButton
  },
  props: {
    id: { type: Number, required: true },
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
    isLastColumn: { type: Boolean, default: false }
  },
  data: () => ({
    isSubmitting: false
  }),
  computed: {
    isLabels() { return this.labels.length > 0; },
    isActionVisible() {
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
    }
  },
  methods: {
    ...call([
      'board/setCurrentIssue',
      'board/updateIssueState'
    ]),
    goToIssue() {
      this.setCurrentIssue({ issue: this });
      this.$router.push({
        name: 'issue',
        params: { issueId: this.id, issueNumber: this.number }
      });
    },
    async close() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;

      await this.updateIssueState({
        id: this.id,
        columnId: this.columnId,
        isClosed: true
      });

      this.isSubmitting = false;
    },
    archive() {
      console.log('TODO: archive');
    }
  }
}
</script>

<style scoped lang='sass'>
.issue
  background-color: #fff
  border-radius: 4px
  margin-bottom: 8px
  padding: 8px
  cursor: pointer

  .title
    color: #212121
    font-size: 15px
    font-weight: 500
    line-height: 18px
    word-break: break-word

  a.url
    color: #757575
    display: inline-block
    margin-top: 4px

    &:hover
      color: #616161
      // text-decoration: underline

    .number
      color: #616161
      font-weight: 500

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
            background-image: url('../../assets/icons/closed.svg')
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
      // width: 104px

      .assignee
        display: inline-block
        vertical-align: bottom
        border-radius: 11px
        height: 22px
        margin: 2px 0 0 4px
        width: 22px
</style>
