<template>
  <div class='online-edit' @click='close'>
    <div class='button-grid'>
      <div class='button' @click.stop='toggleAssignees'>
        Assigness
        <span class='gear' />

        <Select
          v-if='isAssigneesSelectOpen'
          title='Assign up to 10 people to this issue'
          class='select-assignees'
        >
          <Loader v-if='isLoading' is-inline />
          <div class='body-assignees' v-else>
            <div
              v-for='user in assignableUsers'
              class='assignable-user'
              :key='user.login'
              @click='toggleAssign(user)'
            >
              <span class='check' :class="{ checked: isAssigned(user) }" />
              <img class='avatar' :src='user.avatarUrl' />
              <span class='login'>{{ user.login }}</span>
            </div>
          </div>
        </Select>
      </div>

      <div v-if='isSelfAssignVisible' class='button mini' @click.stop='onSelfAssign'>
        <div class='button-inner'>
          <span class='person' />
          &nbsp;Assign yourself
        </div>
        <span class='note'>apply</span>
      </div>
    </div>

    <div class='button' @click.stop='toggleLabels'>
      Labels
      <span class='gear' />
      <Select
        v-if='isLabelsSelectOpen'
        title='Apply labels to this issue'
        class='select-labels'
      >
        <Loader v-if='isLoading' is-inline />
        <div class='body-labels' v-else>
          <div
            v-for='label in githubLabels'
            class='github-label'
            :key='label.id'
            @click='toggleLabel(label)'
          >
            <span class='check' :class="{ checked: isLabelApplied(label) }" />
            <span class='color' :style='labelColorStyles(label)' />
            <span class='name'>{{ label.name }}</span>
          </div>
        </div>
      </Select>
    </div>

    <div class='button' @click.stop='toggleColors'>
      Color
      <span class='gear' />
      <Select
        v-if='isColorSelectOpen'
        title='Set color'
        class='select-colors'
      >
        <div class='body-colors'>
          <div
            v-for='(color, $index) in availableColors'
            :key='$index'
            class='available-color'
            @click='toggleColor(color)'
          >
            <span class='check' :class="{ checked: isColorApplied(color) }" />
            <span class='color' :style='colorStyles(color)' />
            <span class='name'>{{ color.name }}</span>
          </div>
        </div>
      </Select>
    </div>
    <div class='button' @click.stop='toggleColumns'>
      Column
      <span class='gear' />
      <Select
        v-if='isColumnSelectOpen'
        title='Change column'
        class='select-columns'
      >
        <div class='body-columns'>
          <div
            v-for='(column, $index) in sortedColumns'
            :key='$index'
            class='list-item'
            @click='toggleColumn(column)'
          >
            <span class='check' :class="{ checked: isColumnApplied(column) }" />
            <span class='name'>{{ column.name }}</span>
          </div>
        </div>
      </Select>
    </div>

    <div class='button' @click.stop='onCopyTitle'>
      <div class='button-inner'>
        <span class='copy' />
        &nbsp;Title
      </div>
      <span class='note'>copy</span>
    </div>
    <div class='button' @click.stop='onCopyUrl'>
      <div class='button-inner'>
        <span class='copy' />
        &nbsp;Card link
      </div>
      <span class='note'>copy</span>
    </div>
    <div class='button' @click.stop='onCopyGithubUrl'>
      <div class='button-inner'>
        <span class='copy' />
        &nbsp;GitHub link
      </div>
      <span class='note'>copy</span>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader';
import Select from '@/components/select';
import { COLORS, DEFAULT_COLOR, colorStyles, labelColorStyles } from '@/utils/colors';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    Loader,
    Select
  },
  props: {
    issueId: { type: Number, required: true },
    columnId: { type: Number, required: true },
    url: { type: String, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    repositoryFullName: { type: String, required: true },
    assignees: { type: Array, required: true },
    labels: { type: Array, required: true },
    color: { type: String, required: false, default: null },
  },
  data: () => ({
    isAssigneesSelectOpen: false,
    isLabelsSelectOpen: false,
    isColorSelectOpen: false,
    isColumnSelectOpen: false,
    isLoading: false,
    isSubmitting: false,
    isSubmittingSelfAssign: false,
    assignableUsers: [],
    githubLabels: [],
    availableColors: COLORS
  }),
  computed: {
    currentUserName: get('user/username'),
    currentAvatarUrl: get('user/avatarUrl'),
    columns: get('board/columns'),
    isSelfAssignVisible() {
      if (this.isSubmittingSelfAssign) { return false; }
      return this.assignees.length === 0;
    },
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    },
  },
  methods: {
    ...call([
      'board/fetchAssignableUsers',
      'board/fetchLabels',
      'board/updateIssue',
      'board/moveIssue'
    ]),
    async toggleAssignees() {
      if (this.isLoading) { return; }

      this.isLabelsSelectOpen = false;
      this.isColorSelectOpen = false;
      this.isColumnSelectOpen = false;
      this.isAssigneesSelectOpen = !this.isAssigneesSelectOpen;
      if (this.isAssigneesSelectOpen && this.assignableUsers.length === 0) {
        this.isLoading = true;
        const fetchAssignableUsers = await this.fetchAssignableUsers({
          repositoryFullName: this.repositoryFullName
        });
        this.assignableUsers = [...fetchAssignableUsers].sort((a, b) => (a.login > b.login) ? 1 : -1);
        this.isLoading = false;
      }
    },
    isAssigned({ login }) {
      return this.assignees.findIndex(v => v.login === login) >= 0;
    },
    async toggleAssign(user) {
      if (this.isSubmitting) { return; }
      if (this.assignees.length > 10) { return; }
      this.isSubmitting = true;

      const assignedUser = { ...user, url: `https://github.com/${user.login}` };
      const userIndex = this.assignees.findIndex(v => v.login === assignedUser.login);
      let assignees = [...this.assignees];
      if (userIndex === -1) {
        assignees.push(assignedUser);
      } else {
        assignees.splice(userIndex, 1);
      }
      await this.updateIssue({
        id: this.issueId,
        columnId: this.columnId,
        assignees
      });
      this.isSubmitting = false;
    },
    async toggleLabels() {
      if (this.isLoading) { return; }

      this.isAssigneesSelectOpen = false;
      this.isColorSelectOpen = false;
      this.isColumnSelectOpen = false;
      this.isLabelsSelectOpen = !this.isLabelsSelectOpen;
      if (this.isLabelsSelectOpen && this.githubLabels.length === 0) {
        this.isLoading = true;
        const fetchLabels = await this.fetchLabels({
          repositoryFullName: this.repositoryFullName
        });
        this.githubLabels = [...fetchLabels];
        this.isLoading = false;
      }
    },
    isLabelApplied({ name }) {
      return this.labels.findIndex(v => v.name === name) >= 0;
    },
    labelColorStyles(label) { return labelColorStyles(label); },
    async toggleLabel(label) {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      const labelIndex = this.labels.findIndex(v => v.name === label.name);
      let labels = [...this.labels];
      if (labelIndex === -1) {
        labels.push(label);
      } else {
        labels.splice(labelIndex, 1);
      }
      await this.updateIssue({
        id: this.issueId,
        columnId: this.columnId,
        labels
      });
      this.isSubmitting = false;
    },
    colorStyles(color) { return colorStyles(color); },
    toggleColors() {
      this.isAssigneesSelectOpen = false;
      this.isLabelsSelectOpen = false;
      this.isColumnSelectOpen = false;
      this.isColorSelectOpen = !this.isColorSelectOpen;
    },
    isColorApplied({ color }) {
      return color === this.color;
    },
    async toggleColor({ color }) {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      let newColor = null;
      if (this.color == null) {
        if (color !== DEFAULT_COLOR) { newColor = color; }
      } else {
        if (this.color === color) {
          newColor = DEFAULT_COLOR;
        } else {
          newColor = color;
        }
      }
      if (newColor != null) {
        await this.updateIssue({
          id: this.issueId,
          color: newColor,
          columnId: this.columnId
        });
      }
      this.isSubmitting = false;
    },
    toggleColumns() {
      this.isAssigneesSelectOpen = false;
      this.isLabelsSelectOpen = false;
      this.isColorSelectOpen = false;
      this.isColumnSelectOpen = !this.isColumnSelectOpen;
    },
    isColumnApplied({ id }) {
      return this.columnId === id;
    },
    async toggleColumn(column) {
      if (column == null) return;
      if (column.id === this.columnId) return;

      const fromColumnIndex = this.columns.findIndex(v => v.id === this.columnId);
      const toColumnIndex = this.columns.findIndex(v => v.id === column.id);
      if (fromColumnIndex < 0) return;
      if (toColumnIndex < 0) return;
      const fromColumn = this.columns[fromColumnIndex];
      if (fromColumn == null) return;
      const fromIssueIndex = fromColumn.issues.findIndex(v => v.id === this.issueId);
      if (fromIssueIndex < 0) return;

      this.isSubmitting = true;
      await this.moveIssue({
        fromColumnIndex,
        toColumnIndex,
        fromIssueIndex,
        toIssueIndex: 0 // To TOP
      });

      this.isSubmitting = false;
      this.toggleColumns();
    },
    async onSelfAssign() {
      this.isSubmittingSelfAssign = true;
      await this.toggleAssign({
        login: this.currentUserName,
        avatarUrl: this.currentAvatarUrl
      });
      this.isSubmittingSelfAssign = false;
    },
    onCopyTitle() {
      navigator.clipboard.writeText(`${this.title} #${this.number}`);
    },
    onCopyUrl() {
      const url = `${window.location.origin}/#${this.$route.fullPath}/issues/${this.issueId}/number/${this.number}`;
      navigator.clipboard.writeText(url);
    },
    onCopyGithubUrl() {
      navigator.clipboard.writeText(this.url);
    },
    close() { this.$emit('close'); }
  }
}
</script>

<style lang='sass'>
.online-edit
  position: absolute
  z-index: 4
  margin-left: 6px

  .button-grid
    display: flex

    .button + .button
      margin-left: 6px

  .button
    align-items: center
    background-color: #fff
    border-radius: 4px
    box-sizing: border-box
    color: #283593
    cursor: pointer
    display: flex
    height: 30px
    justify-content: space-between
    padding: 0 8px
    width: 220px

    &.mini
      width: 180px

    &:not(.last-child)
      margin-bottom: 6px

    &:hover
      background-color: #E8EAF6

      .note
        display: inline

    &:active
      background-color: #fff

      .note
        display: none

    span.prefix
      font-weight: 200

    .gear,
    .copy,
    .person
      background-position: center
      background-repeat: no-repeat
      background-size: contain
      height: 12px
      width: 12px
    .gear
      background-image: url('../../../assets/icons/issue/gear.svg')
    .copy
      background-image: url('../../../assets/icons/issue/copy.svg')
    .person
      background-image: url('../../../assets/icons/issue/person.svg')

    .button-inner
      align-items: center
      display: flex
      justify-content: flex-start

    .note
      opacity: 0.6
      font-weight: 200
      margin-left: 6px
      display: none

.select-assignees,
.select-labels,
.select-colors,
.select-columns
  position: absolute
  top: 36px
  left: 0
  width: 220px
  z-index: 2

.select-labels
  top: 72px
.select-colors
  top: 108px
.select-columns
  top: 144px

// TODO: Extract assignable-user select - /components/board/issues/assignees
.assignable-user
  display: flex
  align-items: center

  .avatar
    border-radius: 11px
    height: 22px
    margin-right: 4px
    width: 22px

  .login
    font-size: 14px
    font-weight: 500
    color: #212121

.assignable-user
  padding: 8px
  cursor: pointer

  &:hover
    background-color: rgba(197, 202, 233, 0.8) // #c5cae9

  &:active
    background-color: rgba(197, 202, 233, 0.6) // #c5cae9

  &:not(:last-child)
    border-bottom: 1px solid #c5cae9

  .check
    background-image: url('../../../assets/icons/issue/check.svg')
    background-position: center
    background-repeat: no-repeat
    height: 16px
    margin-right: 8px
    opacity: 0
    width: 16px

    &.checked
      opacity: 100

// TODO: Extract body-labels select - /components/board/issues/labels
.body-labels
  overflow-y: scroll
  max-height: calc(100vh - 320px)

.github-label
  display: flex
  align-items: center
  padding: 8px
  cursor: pointer

  &:hover
    background-color: rgba(197, 202, 233, 0.8) // #c5cae9

  &:active
    background-color: rgba(197, 202, 233, 0.6) // #c5cae9

  &:not(:last-child)
    border-bottom: 1px solid #c5cae9

  .check
    background-image: url('../../../assets/icons/issue/check.svg')
    background-position: center
    background-repeat: no-repeat
    height: 16px
    margin-right: 8px
    opacity: 0
    width: 16px

    &.checked
      opacity: 100

  .color
    height: 14px
    width: 14px
    border-radius: 7px
    margin-right: 8px

  .name
    font-size: 14px
    font-weight: 500
    color: #212121

// NOTE: Duplicate board/issue/colors
.body-colors
  overflow-y: scroll
  max-height: calc(100vh - 400px)

.body-columns
  overflow-y: scroll
  max-height: calc(100vh - 400px)

// TODO: Extract select-colors select - /components/board/issues/colors
.available-color
  display: flex
  align-items: center
  padding: 8px
  cursor: pointer

  &:hover
    background-color: rgba(197, 202, 233, 0.8) // #c5cae9

  &:active
    background-color: rgba(197, 202, 233, 0.6) // #c5cae9

  &:not(:last-child)
    border-bottom: 1px solid #c5cae9

  .check
    background-image: url('../../../assets/icons/issue/check.svg')
    background-position: center
    background-repeat: no-repeat
    height: 16px
    margin-right: 8px
    opacity: 0
    width: 16px

    &.checked
      opacity: 100

  .color
    height: 14px
    width: 14px
    border-radius: 7px
    margin-right: 8px
    border: 1px solid
    box-sizing: border-box

  .name
    font-size: 14px
    font-weight: 500
    color: #212121

.list-item
  display: flex
  align-items: center
  padding: 8px
  cursor: pointer

  &:hover
    background-color: rgba(197, 202, 233, 0.8) // #c5cae9

  &:active
    background-color: rgba(197, 202, 233, 0.6) // #c5cae9

  &:not(:last-child)
    border-bottom: 1px solid #c5cae9

  .check
    background-image: url('../../../assets/icons/issue/check.svg')
    background-position: center
    background-repeat: no-repeat
    height: 16px
    margin-right: 8px
    opacity: 0
    width: 16px

    &.checked
      opacity: 100

  .name
    font-size: 14px
    font-weight: 500
    color: #212121
</style>
