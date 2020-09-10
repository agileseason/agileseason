<template>
  <div class='menu'>
    <div class='left-button' />
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
  computed: {
    boards: get('user/boards'),
    isFull() {
      return this.boards.length === 0;
    }
  },
  methods: {
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

  &:hover
    background-color: #5C6BC0

  &:active
    background-color: #303F9F
</style>
