<template>
  <div class='assignees'>
    <label class='label active' @click='toggleAssignees'>
      <span>Assignees</span>
      <ButtonIcon name='gear' style='float: right; padding: 0' />
    </label>
    <div
      v-for='(assignee, $index) in assignees'
      :key='$index'
      :title='assignee.url'
      class='assignee'
    >
      <img class='avatar' :src='assignee.avatarUrl' />
      <span class='login'>{{ assignee.login }}</span>
    </div>
    <Select
      v-if='isSelectOpen'
      title='Assign up to 10 people to this issue'
      class='select-assignees'
    >
      <Loader v-if='isLoading' is-inline />
      <div v-else>
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
    <div v-if='isSelfAssignVisible' class='self-assign'>
      None — <b @click='selfAssign'>assign your self</b>
    </div>
  </div>
  <div v-if='isSelectOpen' class='select-assignees-overlay' @click.self='toggleAssignees' />
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Loader from '@/components/loader';
import Select from '@/components/select';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    ButtonIcon,
    Loader,
    Select
  },
  props: {
    assignees: { type: Array, required: true },
    repositoryFullName: { type: String, required: true }
  },
  emits: ['assign'],
  data: () => ({
    isSelectOpen: false,
    isLoading: true,
    assignableUsers: []
  }),
  computed: {
    currentUserName: get('user/username'),
    currentAvatarUrl: get('user/avatarUrl'),
    isSelfAssignVisible() {
      return this.assignees.length === 0;
    }
  },
  watch: {
    repositoryFullName(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      this.assignableUsers = [];
      this.isLoading = true;
    }
  },
  methods: {
    ...call([
      'board/fetchAssignableUsers',
    ]),
    selfAssign() {
      this.assign({
        login: this.currentUserName,
        avatarUrl: this.currentAvatarUrl
      });
    },
    assign(user) {
      if (this.assignees.length > 10) { return; }

      const assignedUser = {
        ...user,
        url: `https://github.com/${user.login}`
      };
      this.$emit('assign', assignedUser);
    },
    async toggleAssignees() {
      this.isSelectOpen = !this.isSelectOpen;
      if (this.isSelectOpen && this.assignableUsers.length === 0) {
        this.isLoading = true;
        const fetchAssignableUsers = await this.fetchAssignableUsers({
          repositoryFullName: this.repositoryFullName
        });
        this.assignableUsers = [...fetchAssignableUsers];
        this.isLoading = false;
      }
    },
    isAssigned({ login }) {
      return this.assignees.findIndex(v => v.login === login) >= 0;
    }
  }
}
</script>

<style scoped lang='sass'>
.assignees
  position: relative

.select-assignees
  position: absolute
  top: 20px
  width: 220px
  z-index: 2

.select-assignees-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

label.label
  align-items: center
  color: #283593
  display: flex
  font-weight: 700
  justify-content: space-between
  margin-bottom: 6px
  user-select: none

  &.active
    cursor: pointer

    &:hover
      opacity: 0.8

.assignee,
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

.assignee
  &:not(:last-child)
    margin-bottom: 4px

.assignable-user
  padding: 8px
  cursor: pointer

  &:hover
    background-color: #c5cae9

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


.self-assign
  color: #5c6bc0
  cursor: pointer
  font-size: 12px
  font-weight: 100

  b
    font-weight: 400

    &:hover
      opacity: 0.8

    &:active
      opacity: 0.9
</style>
