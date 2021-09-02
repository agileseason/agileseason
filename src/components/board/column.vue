<template>
  <AppDrop
    class='column'
    :class="{ 'droppable': isDroppable }"
    @drop='moveIssueOrColumn'
    @dragenter='dragenter'
    :transferData="{ type: 'column', enterColumnIndex: columnIndex }"
  >
    <AppDrag
      :transferData="{ type: 'column', fromColumnIndex: columnIndex }"
      :is-read-only='isReadOnly'
    >
      <div v-if='isAnySelectsOpen' class='select-overlay' @click.self='hideAllSelects' />
      <div class='header' :class="{ 'read-only': isReadOnly }">
        <span class='issues-count'>{{ issuesCount }}</span>
        <span class='name'>{{ name }}</span>
        <span v-if='isIcons' class='icons'>
          <span v-if='isAutoAssign' class='icon is-auto-assign' title='Auto-assign youself' />
          <span v-if='isAutoClose' class='icon is-auto-close' title='Auto-close issue' />
        </span>
        <div v-if='!isReadOnly' class='actions'>
          <div class='issue-new' @click='issueNew' />
          <div class='column-settings' @click='columnSettings' />
        </div>
        <Select v-if='isSettingsOpen' class='select-settings'>
          <div class='item' @click='openRenameDialog'>Edit</div>
          <div class='item danger' @click='openDeleteDialog'>Delete</div>
        </Select>
        <Dialog
          v-if='isDialogOpen'
          @close='closeRenameDialog'
          class='dialog'
          style='top: 32px'
          title='Column name'
        >
          <input
            v-model.trim='newName'
            class='dialog-input'
            type='text'
            @keyup.enter='submit'
            @keyup.esc='closeRenameDialog'
            placeholder='New column name'
            ref='newName'
          />
          <div class='automation'>
            <div class='title'>Automation</div>
            <label>
              <input v-model='newIsAutoAssign' type='checkbox'>
              Auto-assign yourself
            </label>
            <label>
              <input v-model='newIsAutoClose' type='checkbox'>
              Auto-close issue
            </label>
          </div>
          <template #actions>
            <Button @click='closeRenameDialog' type='flat' text='Close' />
            <Button
              :is-loading='isSubmitting'
              @click='submit'
              type='white'
              text='Update'
            />
          </template>
        </Dialog>
        <Dialog
          v-if='isDeleteDialogOpen'
          @close='closeDeleteDialog'
          class='dialog'
          style='top: 32px'
          :title=deleteDialogTitle
        >
          <p v-if='issuesCount > 0'>The column must be without issues</p>
          <template #actions>
            <Button @click='closeDeleteDialog' type='flat' text='Close' />
            <Button
              :is-loading='isDeleting'
              :is-disabled='issuesCount > 0'
              @click='deleteColumn'
              type='white'
              text='Delete'
            />
          </template>
        </Dialog>
      </div>
      <div class='body'>
        <Issue
          v-for='(issue, $index) in notArchivedIssues'
          :key='issue.id'
          v-bind='issue'
          :column-id='id'
          :column-index='columnIndex'
          :issue-index='$index'
          :is-read-only='isReadOnly'
          :is-last-column='isLastColumn'
        />
      </div>
    </AppDrag>
  </AppDrop>
</template>

<script>
import Button from '@/components/buttons/button';
import Dialog from '@/components/dialog';
import Issue from '@/components/board/issue';
import Select from '@/components/select';

import AppDrag from '@/components/app_drag';
import AppDrop from '@/components/app_drop';
import movingIssuesAndColumns from '@/mixins/moving_issues_and_columns';

import { call, get } from 'vuex-pathify';

export default {
  name: 'Column',
  components: {
    AppDrag,
    AppDrop,
    Button,
    Dialog,
    Issue,
    Select
  },
  props: {
    id: { type: Number, required: true },
    name: { type: String, default: 'Unknown' },
    position: { type: Number, required: true },
    issues: { type: Array, required: true },
    isAutoAssign: { type: Boolean, default: false },
    isAutoClose: { type: Boolean, default: false },
    isLastColumn: { type: Boolean, default: false },
    isReadOnly: { type: Boolean, default: false },
  },
  mixins: [movingIssuesAndColumns],
  data: () => ({
    newName: '',
    newIsAutoAssign: false,
    newIsAutoClose: false,
    isSettingsOpen: false,
    isDialogOpen: false,
    isDeleteDialogOpen: false,
    isSubmitting: false,
    isDeleting: false
  }),
  computed: {
    dragenterColumnId: get('board/dragenterColumnId'),
    issuesCount() { return this.notArchivedIssues.length; },
    notArchivedIssues() { return this.issues.filter(issue => !issue.isArchived); },
    isAnySelectsOpen() { return this.isSettingsOpen; },
    deleteDialogTitle() { return `Delete ${ this.name }`; },
    isIcons() { return this.isAutoAssign || this.isAutoClose; },
    isDroppable() {
      return this.dragenterColumnId == this.id;
    }
  },
  methods: {
    ...call([
      'board/updateBoardColumn',
      'board/removeBoardColumn'
    ]),
    issueNew() {
      this.$router.push({
        name: 'issue_new',
        params: { columnId: this.id }
      });
    },
    columnSettings() {
      this.isSettingsOpen = !this.isSettingsOpen;
    },
    openRenameDialog() {
      this.hideAllSelects();
      this.newName = this.name;
      this.newIsAutoAssign = this.isAutoAssign;
      this.newIsAutoClose = this.isAutoClose;
      this.isDialogOpen = true;
      this.$nextTick(() => this.$refs.newName?.focus());
    },
    openDeleteDialog() {
      this.hideAllSelects();
      this.isDeleteDialogOpen = true;
    },
    closeRenameDialog() {
      this.isDialogOpen = false;
    },
    closeDeleteDialog() {
      this.isDeleteDialogOpen = false;
    },
    async submit() {
      if (this.isSubmitting) { return; }

      if (this.name === this.newName && this.isAutoAssign === this.newIsAutoAssign && this.isAutoClose === this.newIsAutoClose) {
        this.isDialogOpen = false;
      } else {
        this.isSubmitting = true;
        await this.updateBoardColumn({
          id: this.id,
          name: this.newName,
          isAutoAssign: this.newIsAutoAssign,
          isAutoClose: this.newIsAutoClose
        });
        this.isSubmitting = false;
        this.isDialogOpen = false;
      }
    },
    async deleteColumn() {
      if (this.issuesCount > 0) { return; }
      if (this.isDeleting) { return; }

      this.isDeleting = true;
      const isSuccess = await this.removeBoardColumn({ id: this.id });
      if (!isSuccess) {
        this.isDeleting = false;
      }
    },
    hideAllSelects() {
      this.isSettingsOpen = false;
    }
  }
}
</script>

<style scoped lang='sass'>
.select-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

.select-settings
  overflow: hidden
  position: absolute
  right: 0
  top: 32px
  z-index: 2

  .item
    cursor: pointer
    padding: 8px 10px
    min-width: 100px

    &.danger
      color: #d73a49

      &:hover
        background-color: #d73a49
        color: #fff

    &:hover
      background-color: #c5cae9

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9

.dialog
  // TODO: Extract dialog-input component. See also column_new.vue
  input.dialog-input
    background-color: #7986cb
    border-radius: 3px
    border: 1px solid #7986cb
    box-sizing: border-box
    color: #fff
    font-size: 16px
    font-weight: 400
    height: 28px
    letter-spacing: 0.4px
    margin-bottom: 8px
    outline: none
    padding: 0 6px
    width: 100%

    &:focus
      border-color: #fff

    &::placeholder
      color: #9fa8da
      opacity: 1
    &:-ms-input-placeholder
      color: #9fa8da
    &::-ms-input-placeholder
      color: #9fa8da

  .automation
    margin: 8px 0 12px

    .title
      color: #fff
      font-size: 14px
      font-weight: 500
      margin-bottom: 8px

    label
      align-items: center
      cursor: pointer
      display: block
      display: flex
      font-weight: 200
      margin-bottom: 8px

      input
        margin: 0 6px 0 0

  button + button
    margin-left: 2px

.column
  background-color: #e8eaf6
  border-radius: 6px
  display: inline-block
  margin-right: 8px
  position: relative
  vertical-align: top
  width: 270px

  &.droppable
    background-color: rgba(197,202,233,0.4)

  // TODO: Remove if unnecessary
  &.is-drag-start
    // background-color: #e8eaf6
    // border-radius: 6px

  .header
    margin-bottom: 8px

    &:not(.read-only)
      // cursor: grab
      // cursor: grabbing
      cursor: pointer

    .issues-count
      background-color: #C5CAE9
      border-radius: 4px
      box-sizing: border-box
      color: #5C6BC0
      display: inline-block
      font-size: 13px
      height: 24px
      line-height: 24px
      margin-right: 8px
      min-width: 24px
      padding: 0 8px
      text-align: center

    .name
      color: #283593
      display: inline-block
      font-weight: 500
      line-height: 24px
      vertical-align: bottom

    .icons
      .icon
        background-position: center
        background-repeat: no-repeat
        display: inline-block
        height: 16px
        margin-left: 6px
        vertical-align: bottom
        width: 16px

        &.is-auto-assign
          margin-bottom: 3px
          background-image: url('../../assets/icons/column/person.svg')

        &.is-auto-close
          background-image: url('../../assets/icons/column/closed.svg')
          margin-bottom: 4px

    .actions
      float: right

      .issue-new,
      .column-settings
        border-radius: 4px
        cursor: pointer
        display: inline-block
        height: 24px
        margin-left: 6px
        width: 24px
        background-position: center
        background-repeat: no-repeat

        &:hover
          background-color: #C5CAE9
        &:active
          background-color: #9FA8DA

      .issue-new
        background-image: url('../../assets/icons/plus.svg')

        &:hover
          background-image: url('../../assets/icons/plus-hover.svg')
        &:active
          background-image: url('../../assets/icons/plus-hover.svg')

      .column-settings
        background-image: url('../../assets/icons/dots.svg')

        &:hover
          background-image: url('../../assets/icons/dots-hover.svg')
        &:active
          background-image: url('../../assets/icons/dots-hover.svg')

  .body
    height: calc(100vh - 80px)
    overflow-y: scroll
</style>
