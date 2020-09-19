<template>
  <TopMenu
    title='Settings'
    :breadCrumbs='breadCrumbs'
  />
  <Tabs
    :items='tabs'
    :active='active'
    @select='selectTab'
  />
  <div class='body'>
    <div v-if='active === "General"'>
      TODO: {{ active }}
    </div>
    <div v-if='active === "Repositories"'>
      TODO: {{ active }}
    </div>
    <div v-if='active === "Members"'>
      TODO: {{ active }}
    </div>
  </div>

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
import Tabs from '@/components/tabs/tabs.vue'
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'BoardSettings',
  components: {
    Tabs,
    TopMenu
  },
  data: () => ({
    tabs: [
      'General',
      'Repositories',
      'Members'
    ],
    active: 'Repositories'
    // active: 'General'
  }),
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
  created() {
    // const user = await this.fetchProfileLazy();
    // if (user == null) {
    //   this.$router.push({ name: 'home' });
    // } else if (user.boards.length === 0) {
    //   this.$router.push({ name: 'board_new' });
    // }
  },
  methods: {
    ...call([
      'user/fetchProfileLazy'
    ]),
    selectTab(item) {
      this.active = item;
    }
  }
}
</script>

<style scoped lang='sass'>
.body
  background-color: #FFF
  height: calc(100vh - 101px)
  padding: 30px 20px
  box-sizing: border-box
</style>
