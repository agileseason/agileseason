<template>
  <GlobalEvents
    :filter="(event, handler, eventName) => event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA'"
    @keyup.esc='close'
    @keypress.prevent.ctrl.k.exact='commandWindow'
    @keypress.prevent.ctrl.b.exact='goToBoards'
  />

  <div class='menu'>
    <div
      class='left-button'
      :class='{ "is-expanded": isExpanded }'
      @click='toggle'
    />
    <div class='left-menu-backdrop' @click='toggle' v-if='isExpanded' />
    <transition name='slide' :duration='200'>
      <div
        v-show='isExpanded'
        class='left-menu'
        :class='{ "is-expanded": isExpanded }'
      >
        <div class='avatar'>
          <img v-if='isLoaded' :src='avatarUrl' />
        </div>
        <div v-if='isLoaded' class='username'>{{ username }}</div>
        <div v-else class='username'>Loading...</div>
        <div class='item-group'>
          <router-link v-if='isFull' to='/boards'>Boards</router-link>
          <router-link v-else to='/boards/new'>New Board</router-link>
          <router-link to='/settings'>Settings</router-link>
        </div>
        <div class='item-group'>
          <button @click='signout'>Sign Out</button>
        </div>
      </div>
    </transition>
    <div class='center'>
      <div v-if='breadCrumbs' class='bread-crumbs'>
        <div v-for='item in breadCrumbs' :key='item.name' class='item'>
          <router-link v-if='item.path' :to='item.path'>{{ item.name }}</router-link>
          <span class='delimiter'>/</span>
        </div>
      </div>
      <span v-if='title' class='title'>
        {{ title }}
      </span>
      <div v-else class='boards-selector'>
        <router-link to='/boards'>Boards</router-link>
        <span class='delimiter'>/</span>
        <BoardSelect :boardId='boardId' />
      </div>
    </div>
    <div class='right'>
      <router-link v-if='isBoardReady' class='icon notifications' :to='boardNotificationsUrl' />
      <router-link v-if='isBoardReady' class='icon charts' :to='boardIssuesAgeChartUrl' />
      <router-link v-if='isBoardReady' class='icon notes' :to='boardNotesUrl' />
      <router-link v-if='isShowSettings' class='icon settings' :to='boardSettingsUrl' />
    </div>
  </div>

  <div
    class='modal-overlay'
    v-if='isLoaded'
    v-show='isNotificationsOpen || isChartOpen || isNotesOpen || isSearchOpen'
    @click.self='backToBoard'
  >
    <router-view v-slot='{ Component }' name='center'>
      <transition name='slide' :duration='200'>
        <component :is='Component' />
      </transition>
    </router-view>
  </div>
</template>

<script>
import BoardSelect from '@/components/menu/select';
import { GlobalEvents } from 'vue-global-events';
import { get, call } from 'vuex-pathify';

export default {
  name: 'TopMenu',
  components: {
    BoardSelect,
    GlobalEvents
  },
  props: {
    title: { type: String, required: false, default: null },
    breadCrumbs: { type: Array, required: false, default: null }
  },
  data: () => ({
    isExpanded: false
  }),
  computed: {
    username: get('user/username'),
    avatarUrl: get('user/avatarUrl'),
    boards: get('user/boards'),
    isLoaded: get('user/isLoaded'),
    isBoardLoaded: get('board/isLoaded'),
    isBoardOwner: get('board/isOwner'),
    isFull() { return this.boards.length > 0; },
    boardId() { return parseInt(this.$route.params.id) || 0; },
    boardNotificationsUrl() { return `/boards/${this.boardId}/notifications`; },
    boardIssuesAgeChartUrl() { return `/boards/${this.boardId}/charts/age`; },
    boardNotesUrl() { return `/boards/${this.boardId}/notes`; },
    boardSettingsUrl() { return `/boards/${this.boardId}/settings`; },
    isBoardReady() {
      return this.boardId > 0 && this.isBoardLoaded;
    },
    isShowSettings() { return this.isBoardReady && this.isBoardOwner; },
    isNotificationsOpen() { return this.$route.name === 'notifications'; },
    isNotesOpen() { return this.$route.name === 'notes'; },
    isSearchOpen() {
      return this.$route.name === 'search' || this.$route.name === 'search_board';
    },
    isChartOpen() { return this.$route.name === 'issues_age_chart'; }
  },
  async created() {
    await this.fetchProfileLazy();
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'user/logout',
      'board/setCurrentIssue'
    ]),
    toggle() { this.isExpanded = !this.isExpanded; },
    close() {
      if (this.isExpanded) { this.isExpanded = false; }
      if (this.isNotesOpen || this.isSearchOpen) { this.backToBoard(); }
    },
    commandWindow() {
      if (this.boards.length === 0) { return; }
      if (this.boardId) {
        this.$router.push({ name: 'search_board' });
      } else {
        this.$router.push({ name: 'search' });
      }
    },
    backToBoard() {
      if (this.boardId) {
        this.setCurrentIssue({ issue: {} });
        this.$router.push({ name: 'board', id: this.boardId });
      } else {
        this.goToBoards();
      }
    },
    goToBoards() {
      this.$router.push({ name: 'boards' });
    },
    signout() {
      this.logout();
      window.location = '/';
    }
  }
};
</script>

<style scoped lang='sass'>
.menu
  height: 36px
  background-color: #3f51b5
  position: relative

.center
  text-align: center

.title
  color: #fff
  font-weight: 500
  line-height: 36px

.bread-crumbs
  display: inline-block

  .item
    display: inline-block

.boards-selector,
.bread-crumbs
  text-align: center
  line-height: 36px

  a
    color: #9fa8da
    text-decoration: none

    &:hover
      color: #e8eaf6

    &:active
      color: #c5cae9

  .delimiter
    color: #9fa8da
    margin: 0 3px

.left-button
  background-image: url('../../assets/icons/menu/three-bars.svg')
  background-position: center
  background-repeat: no-repeat
  border-radius: 4px
  cursor: pointer
  display: inline-block
  height: 28px
  left: 8px
  position: absolute
  top: 4px
  width: 28px
  z-index: 4

  &.is-expanded
    &:hover
      background-color: #283593

  &:hover
    background-color: #5c6bc0

  &:active
    background-color: #303f9f

.left-menu
  background-color: #283593
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 320px
  z-index: 3

  .avatar
    height: 60px
    width: 60px
    border-radius: 30px
    margin: 40px auto 10px
    background-color: #5c6bc0

    img
      height: 60px
      width: 60px
      border-radius: 30px

  .username
    color: #fff
    font-size: 16px
    font-weight: 500
    letter-spacing: 0.3px
    margin: 0 auto 30px
    text-align: center

  .item-group
    border-top: 1px solid #7986cb
    padding: 10px 14px 0 14px

    a,
    button
      background-color: transparent
      border: none
      color: #9fa8da
      cursor: pointer
      display: block
      font-size: 16px
      font-weight: 300
      margin-bottom: 14px
      padding: 4px 0
      text-align: left
      text-decoration: none
      width: 100%

      &:hover
        color: #c5cae9

      &:active
        color: #7986cb

.left-menu-backdrop
  z-index: 2
  width: 100vw
  height: 100vh
  position: fixed
  top: 0
  left: 0

.left-menu
  transform: translateX(-100%)

  &.slide-enter-to
    transform: translateX(0%)

  &.is-expanded:not(.slide-enter-active)
    transform: none

.slide-enter-active,
.slide-leave-active
  transition: transform 200ms

.right
  position: absolute
  right: 8px
  top: 4px

  .icon
    background-position: center
    background-repeat: no-repeat
    border-radius: 4px
    cursor: pointer
    display: inline-block
    height: 28px
    margin-left: 4px
    width: 28px

    &:hover
      background-color: #5c6bc0

    &:active
      background-color: #303f9f

    &.notifications
      background-image: url('../../assets/icons/menu/bell.svg')

    &.charts
      background-image: url('../../assets/icons/menu/graph.svg')

    &.settings
      background-image: url('../../assets/icons/menu/gear.svg')

    &.notes
      background-image: url('../../assets/icons/menu/note.svg')
</style>
