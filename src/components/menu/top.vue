<template>
  <div class='menu'>
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
  vertical-align: middle
  text-align: center
  font-weight: 500
  font-size: 14px
  line-height: 34px
  color: #FFFFFF
</style>
