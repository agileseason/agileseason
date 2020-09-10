<template>
  <div class='menu'>
    <div class='left-button' @click='toggle' />
    <div class='left-menu-backdrop' @click='toggle' v-if='isExpanded' />
    <transition name='slide'>
      <div v-if='isExpanded' class='left-menu' />
    </transition>
    <div v-if='title' class='title'>
      {{ title }}
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify';

export default {
  name: 'TopMenu',
  props: {
    title: { type: String, required: false, default: null },
  },
  data: () => ({
    isExpanded: false
  }),
  computed: {
    boards: get('user/boards'),
    isFull() {
      return this.boards.length === 0;
    }
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
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
