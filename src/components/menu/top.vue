<template>
  <div class='menu'>
    <slot />
  </div>
</template>

<script>
import { get } from 'vuex-pathify';

export default {
  name: 'TopMenu',
  props: {
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
</style>
