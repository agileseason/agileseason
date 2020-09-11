<template>
  <div class='menu'>
    <div class='left-button' @click='toggle' />
    <div class='left-menu-backdrop' @click='toggle' v-if='isExpanded' />
    <transition name='slide'>
      <div v-if='isExpanded' class='left-menu'>
        <div class='avatar'>
          <img v-if='isLoaded' :src='avatarUrl' />
        </div>
        <div v-if='isLoaded' class='username'>{{ username }}</div>
        <div v-else class='username'>Loading...</div>
        <div class='item-group'>
          <router-link v-if='isFull' to='/boards'>Boards</router-link>
          <router-link v-else to='/boards/new'>New Board</router-link>
          <!-- TODO: Replace route to billing path -->
          <router-link to='/boards'>Billing</router-link>
        </div>
        <div class='item-group'>
          <button @click='signout'>Sign Out</button>
        </div>
      </div>
    </transition>
    <div v-if='title' class='title'>
      {{ title }}
    </div>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'TopMenu',
  props: {
    title: { type: String, required: false, default: null },
  },
  data: () => ({
    isExpanded: false
  }),
  computed: {
    username: get('user/username'),
    avatarUrl: get('user/avatarUrl'),
    boards: get('user/boards'),
    isLoaded: get('user/isLoaded'),
    isFull() {
      return this.boards.length > 0;
    }
  },
  async created() {
    await this.fetchProfileLazy();
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'user/logout'
    ]),
    toggle() {
      this.isExpanded = !this.isExpanded;
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
  background-color: #3F51B5

.title
  color: #FFFFFF
  font-size: 14px
  font-weight: 500
  line-height: 34px
  text-align: center
  vertical-align: middle

.left-button
  background-image: url('../../assets/icons/three-bars.svg')
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

  &:hover
    background-color: #5C6BC0

  &:active
    background-color: #303F9F

.left-menu
  background-color: #283593
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 320px
  z-index: 3
  // transition: transform 30ms ease-in-out 0ms

  .avatar
    height: 60px
    width: 60px
    border-radius: 30px
    margin: 40px auto 10px
    background-color: #5C6BC0

    img
      height: 60px
      width: 60px
      border-radius: 30px

  .username
    color: #FFF
    font-size: 16px
    font-weight: 500
    letter-spacing: 0.3px
    margin: 0 auto 30px
    text-align: center

  .item-group
    border-top: 1px solid #7986CB
    padding: 10px 14px 0 14px

    a,
    button
      background-color: transparent
      border: none
      color: #9FA8DA
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
        color: #C5CAE9

      &:active
        color: #7986CB

.left-menu-backdrop
  z-index: 2
  // background-color: rgba(0,0,0,.1)
  width: 100vw
  height: 100vh
  position: fixed
  top: 0
  left: 0

.slide-enter-active,
.slide-leave-active
  // transform: translateX(-100%)
  // transition: transform 1.2s ease

.slide-enter,
.slide-leave-to
  transform: translateX(-100%)
  transition: all 200ms ease 0ms
</style>
