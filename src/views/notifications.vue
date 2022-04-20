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
      <div v-for='item in items' :key='item.id' class='notification'>
        {{item.id}} {{item.action}}
      </div>
    </div>

  </Modal>
</template>

<script>
import Loader from '@/components/loader';
import Modal from '@/components/modal';

import { get, call } from 'vuex-pathify';

export default {
  components: {
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
  margin: 0px 8px
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

.right-side
  background-color: #283593
  border-radius: 0
  box-shadow: none
  min-height: 100vh
</style>
