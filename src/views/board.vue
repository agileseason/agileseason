<template>
  <TopMenu />

  <div class='board'>
    TODO: Column
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
    ])
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px
</style>
