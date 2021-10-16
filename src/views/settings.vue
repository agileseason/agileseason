<template>
  <TopMenu title='Account settings' />

  <Loader v-if='!isLoaded' />
  <div v-if='isLoaded' class='settings'>
    TODO: Settings
  </div>
</template>

<script>
import TopMenu from '@/components/menu/top.vue'
import Loader from '@/components/loader';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
    Loader,
    TopMenu
  },
  data: () => ({}),
  computed: {
    isLoaded: get('user/isLoaded'),
    token: get('user/token'),
    boards: get('user/boards')
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
    ]),
  }
}
</script>

<style scoped lang='sass'>
</style>
