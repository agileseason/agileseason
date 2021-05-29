<template>
  <Menu
    :title='boardName'
    :username='boardOwner.login'
    :avatarUrl='boardOwner.avatarUrl'
  />
  <Loader v-if='isLoading' />
  <div v-if='isNotFound' class='not-found'>Page not found</div>
  <div v-if='board' class='board'>
    <div class='columns'>
      <Column
        v-for='column in board.columns'
        :key='column.id'
        v-bind='column'
        is-read-only
      />
    </div>
  </div>
</template>

<script>
import Column from '@/components/board/column.vue';
import Loader from '@/components/loader';
import Menu from '@/components/menu/top_shared';
import api from '@/api';

export default {
  components: {
    Column,
    Loader,
    Menu
  },
  data: () => ({
    isLoading: true,
    board: undefined
  }),
  computed: {
    // token: get('user/token'),
    // username: get('user/username'),
    // isSignedIn: get('user/isSignedIn'),
    token() { return this.$route.params.token; },
    isNotFound() { return !this.isLoading && this.board == null; },
    boardName() { return this.board?.name; },
    boardOwner() { return this.board?.owner || {}; }
  },
  async created() {
    this.board = await api.fetchSharedBoard({ sharedToken: this.token });
    this.isLoading = false;
  },
  methods: {
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px
  overflow-x: scroll

.not-found
  font-size: 16px
  text-align: center
  margin-top: 80px
</style>
