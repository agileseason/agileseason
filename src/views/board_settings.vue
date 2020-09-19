<template>
  <TopMenu
    title='Settings'
    :breadCrumbs='breadCrumbs'
  />

  <!--div v-if='isLoaded' class='boards'>
    <div
      v-for='board in boards'
      :key='board.id'
      class='board'
      @click='goto(board)'
    >
      <div class='name'>
        {{ board.name }}
      </div>
    </div>

    <router-link class='board new' to='/boards/new'>New Board...</router-link>
  </div-->
</template>

<script>
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'BoardSettings',
  components: {
    TopMenu
  },
  data: () => ({}),
  computed: {
    isLoaded: get('user/isLoaded'),
    token: get('user/token'),
    boards: get('user/boards'),
    boardId() { return parseInt(this.$route.params.id) || 0; },
    breadCrumbs() {
      const board = this.boards.find(v => v.id === this.boardId);
      if (board == null) {
        return [
          { name: 'Boards', path: '/boards' }
        ];
      }

      return [
        { name: 'Boards', path: '/boards' },
        { name: board.name, path: `/boards/${this.boardId}` }
      ];
    }
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
      'user/fetchProfileLazy'
    ]),
    goto({ id }) {
      this.$router.push({ name: 'board', params: { id } });
    }
  }
}
</script>

<style scoped lang='sass'>
</style>
