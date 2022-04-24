<template>
  <Modal class='right-side'>
    <div class='header'>
      <div class='title'>
        <span class='icon'/>
        Notifications
      </div>
      <div @click='close' class='icon close'/>
    </div>

    <Loader v-if='isLoading' color='white' />
    <div v-else class='notifications'>
      <div v-if='isEmpty' class='empty'>
        There are no notifications for this board yet.
      </div>

      <div
        v-for='item in items'
        :key='item.id'
        class='notification'
        @click='click(item)'
      >
        <div class='issue' v-if='item.issue'>
          <div class='title'>{{ item.issue.title }}</div>
          <div v-if='item.issue.labels' class='labels'>
            <Label
              v-for='(label, $index) in item.issue.labels'
              :label='label'
              :key='$index'
            />
          </div>
        </div>
        <div class='description'>
          <span v-if='item.sender' class='login'>{{ item.sender.login }}</span>
          {{ description(item) }}
        </div>
      </div>
    </div>

  </Modal>
</template>

<script>
import Label from '@/components/board/label';
import Loader from '@/components/loader';
import Modal from '@/components/modal';

import { get, call } from 'vuex-pathify';

export default {
  components: {
    Label,
    Loader,
    Modal
  },
  props: {},
  data: () => ({}),
  computed: {
    isLoading: get('notifications/isLoading'),
    items: get('notifications/items'),
    boardId() { return parseInt(this.$route.params.id); },
    isEmpty() {
      return !this.isLoading && this.items.length === 0;
    }
  },
  async mounted() {
    await this.fetch({ boardId: this.boardId });
  },
  methods: {
    ...call([
      'notifications/fetch'
    ]),
    close() {
      this.$router.push({ name: 'board', id: this.boardId });
    },
    click({ issue }) {
      if (issue == null) { return; }

      this.$router.push({
        name: 'issue',
        params: { issueId: issue.id, issueNumber: issue.number }
      });
    },
    description({ sender, issue, action, createdAgo }) {
      if (sender == null) {
        if (issue) {
          return `Issue was ${this.actionText(action)} ${createdAgo}`;
        }
      } else {
        if (issue) {
          // return `${this.actionText(action)} #${issue.number} ${createdAgo}`;
          return `${this.actionText(action)} the issue ${createdAgo}`;
        }
      }
    },
    actionText(action) {
      if (action === 'issue_opened') { return 'opened'; }
      if (action === 'issue_closed') { return 'closed'; }
      if (action === 'issue_reopened') { return 'reopened'; }
      if (action === 'issue_archived') { return 'archived'; }
      if (action === 'issue_unarchived') { return 'unarchived'; }
      return '';
    }
  }
}
</script>

<style scoped lang='sass'>
.header
  color: #fff
  font-size: 16px
  font-weight: 500
  height: 36px
  margin: 0px 8px 0 6px
  display: flex
  align-items: center
  justify-content: space-between

  .icon
    background-image: url('../assets/icons/menu/bell.svg')
    background-position: center
    background-repeat: no-repeat
    display: inline-block
    height: 28px
    width: 28px

  .title
    display: flex
    align-items: center

    .icon
      margin-right: 4px

  .close
    background-image: url('../assets/icons/menu/x-white.svg')
    border-radius: 4px
    cursor: pointer

    &:hover
      background-color: #5c6bc0

    &:active
      background-color: #303f9f

.notifications
  box-sizing: border-box
  height: calc(100vh - 36px)
  overflow-y: scroll
  padding: 0 12px

  .empty
    color: #fff
    text-align: center
    margin-top: 40%

  .notification
    background-color: #fff
    border-radius: 3px
    margin-bottom: 8px
    padding: 8px
    cursor: pointer

    &:hover
      background-color: #e8eaf6

    &:active
      background-color: #c5cae9

    .issue
      .title
        color: #212121
        font-size: 15px
        font-weight: 500
        line-height: 18px
        word-break: break-word

      .label
        margin: 3px 6px 3px 0

    .description
      color: #303f9f
      font-size: 12px
      margin-top: 4px

      .login
        font-weight: 500

.right-side
  background-color: #283593
  border-radius: 0
  box-shadow: none
  min-height: 100vh
</style>
