<template>
  <div class='online-edit'>
    <div class='button' @click='toggleAssignees'>
      Assigness
      <span class='gear' />

      <Select
        v-if='isSelectOpen'
        title='Assign up to 10 people to this issue'
        class='select-assignees'
      >
        <Loader v-if='isLoading' is-inline />
        <div class='body-assignees' v-else>
          <div
            v-for='user in assignableUsers'
            class='assignable-user'
            :key='user.login'
            @click='assign(user)'
          >
            <span class='check' :class="{ checked: isAssigned(user) }" />
            <img class='avatar' :src='user.avatarUrl' />
            <span class='login'>{{ user.login }}</span>
          </div>
        </div>
      </Select>
    </div>
    <div class='button'>
      Labels
      <span class='gear' />
    </div>
    <div class='button'>
      Color
      <span class='gear' />
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader';
import Select from '@/components/select';
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
  },
  data: () => ({
    isSelectOpen: false,
    isLoading: true,
    isSubmitting: false,
    assignableUsers: []
  }),
  computed: {},
  methods: {
    ...call([
      'board/fetchAssignableUsers',
      'board/updateIssue'
    ]),
    async toggleAssignees() {
      this.isSelectOpen = !this.isSelectOpen;
      if (this.isSelectOpen && this.assignableUsers.length === 0) {
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
    async assign(user) {
      if (this.isSubmitting) { return; }
      if (this.assignees.length > 10) { return; }
      this.isSubmitting = true;

      const assignedUser = { ...user, url: `https://github.com/${user.login}` };
      let assignees = [...this.assignees];
      const userIndex = assignees.findIndex(v => v.login === assignedUser.login);
      if (userIndex === -1) {
        assignees.push(assignedUser);
      } else {
        assignees.splice(userIndex, 1);
      }
      await this.updateIssue({
        id: this.issueId,
        assignees,
        columnId: this.columnId
      });
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

  .select-assignees
    position: absolute
    top: 34px
    left: 0
    width: 220px
    z-index: 2

  // TODO: Extract assignable-user select - /components/board/issues/assignees
  //.assignee,
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

  //.assignee
    &:not(:last-child)
      margin-bottom: 4px

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
</style>
