<template>
  <div class='online-edit'>
    <div class='button' @click='toggleAssignees'>
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
    <div class='button' @click='toggleLabels'>
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
    <div class='button' @click='toggleColors'>
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
  </div>
</template>

<script>
import Loader from '@/components/loader';
import Select from '@/components/select';
import { COLORS, DEFAULT_COLOR, colorStyles, labelColorStyles } from '@/utils/colors';
import { call } from 'vuex-pathify';

export default {
  components: {
    Loader,
    Select
  },
  props: {
    issueId: { type: Number, required: true },
    columnId: { type: Number, required: true },
    repositoryFullName: { type: String, required: true },
    assignees: { type: Array, required: true },
    labels: { type: Array, required: true },
    color: { type: String, required: false, default: null },
  },
  data: () => ({
    isAssigneesSelectOpen: false,
    isLabelsSelectOpen: false,
    isColorSelectOpen: false,
    isLoading: false,
    isSubmitting: false,
    assignableUsers: [],
    githubLabels: [],
    availableColors: COLORS
  }),
  computed: {},
  methods: {
    ...call([
      'board/fetchAssignableUsers',
      'board/fetchLabels',
      'board/updateIssue'
    ]),
    async toggleAssignees() {
      if (this.isLoading) { return; }

      this.isLabelsSelectOpen = false;
      this.isColorSelectOpen = false;
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
    }
  }
}
</script>

<style lang='sass'>
.online-edit
  position: absolute
  z-index: 4
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

    &:not(.last-child)
      margin-bottom: 6px

    &:hover
      background-color: #E8EAF6

    &:active
      background-color: #fff

    .gear
      background-image: url('../../../assets/icons/issue/gear.svg')
      background-position: center
      background-repeat: no-repeat
      height: 12px
      width: 12px

.select-assignees,
.select-labels,
.select-colors
  position: absolute
  top: 34px
  left: 0
  width: 220px
  z-index: 2

.select-labels
  top: 72px
.select-colors
  top: 110px

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

// NOTE: Duplicate board/issue/colors
.body-colors
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
</style>
