<template>
  <AppDrop
    class='issue-wrapper'
    @drop='moveIssueOrColumn'
    @dragenter='dragenter'
    :transferData="{ type: 'issue', enterColumnIndex: columnIndex }"
  >
    <OnlineEdit
      v-if='isEditing'
      :style="{ 'left': rectLeft, 'top': rectTop }"
      :issueId='id'
      :url='url'
      :number='number'
      :title='title'
      :assignees='sortedAssignees'
      :labels='labels'
      :repositoryFullName='repositoryFullName'
      :color='color'
      :columnId='columnId'
      @close='onOverlay'
    />
    <div v-if='isEditing' class='overlay' @click.self='onOverlay' />

    <AppDrag
      class='issue'
      ref='issue'
      :class="{
        'read-only': isReadOnly,
        'selected': isSelected,
        'editing': isEditing
      }"
      :style='colorStyles'
      :transferData="{
        type: 'issue',
        fromColumnIndex: columnIndex,
        fromIssueIndex: issueIndex
      }"
      :is-read-only='isReadOnly'
      @click='goToIssue'
    >
      <ButtonIcon
        v-if='!isEditing && !isReadOnly'
        class='edit'
        name='edit'
        @click.stop='onEdit'
      />

      <div class='title'>{{ title }}</div>
      <span v-if='isReadOnly || isEditing' class='url'>
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
              v-if='!isClosed && !isReadOnly'
              name='Close'
              icon='close'
              @click.stop='close'
              :is-submitting='isCloseSubmitting'
            />
            <FastButton
              v-if='isClosed && !isReadOnly && !isEditing'
              name='Archive'
              icon='archive'
              @click.stop='archive'
              :is-submitting='isArchiveSubmitting'
            />
          </div>
        </div>

        <div class='assigned'>
          <Avatar
            v-for='(assignee, $index) in sortedAssignees'
            v-bind='assignee'
            :key='$index'
          />
        </div>
      </div>
      <div v-if='pullRequests.length > 0' class='pull-requests'>
        <div
          v-for='pr in pullRequests'
          class='pull-request'
          :class='pullRequestState(pr)'
          :key='pr.id'
        >
          <span v-if='isReadOnly' class='url'>
            {{pr.repositoryName}}#{{ pr.number }}
          </span>
          <a v-else :href=pr.url @click.stop='click' class='url'>
            {{pr.repositoryName}}#{{ pr.number }}
          </a>
          <div v-if='pr.assignees.length > 0' class='assignees'>
            <Avatar
              v-for='(assignee, $index) in pr.assignees'
              v-bind='assignee'
              :key='$index'
              is-small
            />
          </div>
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
import Avatar from '@/components/avatar';
import ButtonIcon from '@/components/buttons/icon';
import FastButton from '@/components/board/issues/fast_button';
import Label from '@/components/board/label';
import OnlineEdit from '@/components/board/issues/online_edit';
import Progress from '@/components/board/issues/progress';
import movingIssuesAndColumns from '@/mixins/moving_issues_and_columns';
import { issueColorStyles } from '@/utils/colors';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Issue',
  components: {
    AppDrag,
    AppDrop,
    Avatar,
    ButtonIcon,
    OnlineEdit,
    FastButton,
    Label,
    Progress
  },
  props: {
    id: { type: Number, required: true },
    issueIndex: { type: Number, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    repositoryName: { type: String, required: true },
    repositoryFullName: { type: String, required: true },
    labels: { type: Array, required: true },
    assignees: { type: Array, required: true },
    isClosed: { type: Boolean, required: true },
    isBody: { type: Boolean, required: true },
    commentsCount: { type: Number, required: true },
    pullRequests: { type: Array, required: true },
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
    isArchiveSubmitting: false,
    isEditing: false,
    rectLeft: undefined,
    rectTop: undefined
  }),
  computed: {
    ...get([
      'board/currentIssue'
    ]),
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
    colorStyles() { return issueColorStyles(this.color); },
    sortedAssignees() {
      return [...this.assignees].sort((a, b) => (a.login > b.login) ? 1 : -1);
    },
    isSelected() {
      return this.currentIssue?.id === this.id;
    }
  },
  methods: {
    ...call([
      'board/setCurrentIssue',
      'board/updateIssueState'
    ]),
    goToIssue() {
      if (this.isReadOnly) { return; }
      if (this.isEditing) { return; }

      this.setCurrentIssue({ issue: this });
      this.$router.push({
        name: 'issue',
        params: { issueId: this.id, issueNumber: this.number }
      });
    },
    pullRequestState({ isClosed, isMerged }) {
      if (isClosed && isMerged) { return 'merged'; }
      if (isClosed) { return 'closed'; }
      return 'open';
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
    },
    onEdit() {
      this.isEditing = true;
      const columnEl = window.document.getElementById(`column-body-${this.columnId}`);
      const offsetScroll = columnEl.scrollTop;
      this.rectTop = `${this.$refs.issue.$el.offsetTop - offsetScroll}px`;
      this.rectLeft = `${this.$refs.issue.$el.offsetWidth}px`;
    },
    onOverlay() { this.isEditing = false; }
  }
}
</script>

<style scoped lang='sass'>
.issue-wrapper
  padding-bottom: 7px // (+1px from issue boarder)

.issue
  background-color: #FFF
  border-radius: 4px
  cursor: pointer
  margin: 1px // for border when issue is selected
  overflow: hidden
  padding: 6px
  position: relative
  z-index: 2

  &.read-only,
  &.editing
    cursor: default

  &.selected
    outline: 1px solid #7986CB

  &:hover
    .edit
      display: block

  &.editing
    z-index: 4

  .edit
    display: none
    background-color: rgba(48, 63, 159, 0.1)
    border-radius: 3px
    position: absolute
    top: 2px
    right: 2px
    opacity: 0.6

    &:hover
      opacity: 1

    &:active
      opacity: 0.8

  .title
    color: #212121
    font-size: 15px
    font-weight: 500
    line-height: 18px
    word-break: break-word
    margin-bottom: 4px

  .url
    color: #757575
    display: inline-block

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

  .pull-requests
    border-top: 1px solid rgba(0, 0, 0, 0.1)
    color: #757575
    font-size: 12px
    margin: 6px -6px 0 -6px

    .pull-request
      align-items: center
      justify-content: space-between
      background-position: left
      background-repeat: no-repeat
      box-sizing: border-box
      display: flex
      margin: 6px 6px 0 6px
      padding-left: 18px

      &.open
        background-image: url('../../assets/icons/issue/pr_open.svg')
      &.closed
        background-image: url('../../assets/icons/issue/pr_closed.svg')
      &.merged
        background-image: url('../../assets/icons/issue/pr_merged.svg')

      .url
        color: #757575

      a.url // avoid hover in shared mode for span.url
        &:hover
          color: #616161

      .assignees
        display: flex

        .assignee
          margin-left: 2px

    .pull-request + .pull-request
      margin-top: 4px

  .assigned-or-extra + .progress-container
    margin-top: 6px

  .progress-container
    margin: 0 -6px -6px -6px

.overlay
  background: rgba(0, 0, 0, 0.3)
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 3
</style>
