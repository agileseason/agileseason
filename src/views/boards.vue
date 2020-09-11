<template>
  <div class='boards'>
    <TopMenu title='Boards' />

    <h1>TODO: Boards</h1>
    <div v-if='isLoading'>
      Loading...
    </div>
    <div v-else>
      {{ token }}
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
    TopMenu
  },
  data: () => ({}),
  computed: {
    isLoading: get('user/isLoading'),
    token: get('user/token')
  },
  async created() {
    const user = await this.fetchProfile();
    if (user == null) {
      this.$router.push({ name: 'home' });
    } else if (user.boards.length === 0) {
      this.$router.push({ name: 'board_new' });
    }
  },
  methods: {
    ...call([
      'user/fetchProfile'
    ])
  }
}
</script>

<style scoped lang='sass'>
</style>
