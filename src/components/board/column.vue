<template>
  <AppDrop
    class='column'
    @drop='moveTaskOrColumn'
  >
    <AppDrag
      :transferData="{ type: 'column', fromColumnIndex: columnIndex }"
    >
      <div v-if='isAnySelectsOpen' class='select-overlay' @click.self='hideAllSelectes' />
      <div class='header' :class="{ 'read-only': isReadOnly }">
        <span class='issues-count'>{{ issuesCount }}</span>
        <span class='name'>{{ name }}</span>
        <div v-if='!isReadOnly' class='actions'>
          <div class='issue-new' @click='issueNew' />
          <div class='column-settings' @click='columnSettings' />
        </div>
        <Select v-if='isSettingsOpen' class='select-settings'>
          <div class='item' @click='openRenameDialog'>Rename column</div>
          <div class='item' @click='openDeleteDialog'>Delete column</div>
        </Select>
        <Dialog
          v-if='isRenameDialogOpen'
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
          <template #actions>
            <Button @click='closeRenameDialog' type='flat' text='Close' />
            <Button
              :is-loading='isSubmittingNewName'
              @click='submitNewName'
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
          v-for='issue in notArchivedIssues'
          :key='issue.id'
          v-bind='issue'
          :column-id='id'
          :is-read-only='isReadOnly'
          :is-last-column='isLastColumn'
          :draggable='!isReadOnly'
          @dragstart='dragStart($event, issue)'
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

import { call } from 'vuex-pathify';

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
    isLastColumn: { type: Boolean, default: false },
    isReadOnly: { type: Boolean, default: false }
  },
  mixins: [movingIssuesAndColumns],
  data: () => ({
    newName: '',
    isSettingsOpen: false,
    isRenameDialogOpen: false,
    isDeleteDialogOpen: false,
    isSubmittingNewName: false,
    isDeleting: false
  }),
  computed: {
    issuesCount() { return this.notArchivedIssues.length; },
    notArchivedIssues() { return this.issues.filter(issue => !issue.isArchived); },
    isAnySelectsOpen() { return this.isSettingsOpen; },
    deleteDialogTitle() { return `Delete ${ this.name }`; }
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
      this.hideAllSelectes();
      this.newName = this.name;
      this.isRenameDialogOpen = true;
      this.$nextTick(() => this.$refs.newName?.focus());
    },
    openDeleteDialog() {
      this.hideAllSelectes();
      this.isDeleteDialogOpen = true;
    },
    closeRenameDialog() {
      this.isRenameDialogOpen = false;
    },
    closeDeleteDialog() {
      this.isDeleteDialogOpen = false;
    },
    async submitNewName() {
      if (this.newName === '') { return; }
      if (this.isSubmittingNewName) { return; }

      if (this.name === this.newName) {
        this.isRenameDialogOpen = false;
      } else {
        this.isSubmittingNewName = true;
        await this.updateBoardColumn({ id: this.id, name: this.newName });
        this.isSubmittingNewName = false;
        this.isRenameDialogOpen = false;
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
    hideAllSelectes() {
      this.isSettingsOpen = false;
    },
    dragStart(e, issue) {
      console.log('[dragStart] Issue: ' + issue?.id);
      // console.log(e.target.className);
      if (e.target.className === 'issue') {
        // issue.isDragStart = true;
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('itemKind', 'issue');
        e.dataTransfer.setData('itemID', issue.id);
      }
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
  position: absolute
  z-index: 2
  right: 0
  top: 32px

  .item
    cursor: pointer
    padding: 8px 10px

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

  button + button
    margin-left: 2px

.column
  display: inline-block
  margin-right: 8px
  vertical-align: top
  width: 270px
  position: relative

  &.is-drag-enter
    background-color: rgba(197,202,233,0.4)
    border-radius: 6px

  &.is-drag-start
    background-color: #E8EAF6
    border-radius: 6px

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
