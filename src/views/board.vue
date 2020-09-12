<template>
  <TopMenu />

  <div class='board'>
    <div class='columns'>
      <button class='column new' @click='newColumn'>New Column...</button>
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/menu/top.vue';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Board',
  components: {
    TopMenu
  },
  data: () => ({}),
  computed: {
    token: get('user/token')
  },
  async created() {
    await this.fetchProfileLazy();
  },
  methods: {
    ...call([
      'user/fetchProfileLazy'
    ]),
    newColumn() {
      console.log('new column');
    }
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px

  .columns
    .column
      &.new
        background-color: transparent
        border-radius: 4px
        border: 1px solid #C5CAE9
        color: #7986CB
        cursor: pointer
        font-size: 14px
        font-weight: 300
        height: 30px
        width: 270px

        &:hover
          color: #303F9F
          border: 1px solid #9FA8DA

        &:active
          color: #5C6BC0
          border: 1px solid #7986CB
</style>
