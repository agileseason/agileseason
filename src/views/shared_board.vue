<template>
  <Menu
    v-if='!isFullScreen'
    :title='boardName'
    :username='boardOwner.login'
    :avatarUrl='boardOwner.avatarUrl'
  />
  <Loader v-if='isLoading' />
  <div v-if='isNotFound' class='not-found'>Page not found</div>
  <div v-if='board' class='board' :class="{ 'full-screen': isFullScreen }">
    <div class='columns' :style='widthStyles'>
      <Column
        v-for='(column, $index) in board.columns'
        :key='column.id'
        :column-index='$index'
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
    isFullScreen() { return !!this.$route.query.fullScreen; },
    boardName() { return this.board?.name; },
    boardOwner() { return this.board?.owner || {}; },
    widthStyles() {
      if (this.isLoading) { return {}; }
      if (this.board == null) { return {}; }
      return { 'min-width': `${280 * (this.board.columns.length)}px` }
    },
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

  &.full-screen
    padding: 8px 6px

.not-found
  font-size: 16px
  text-align: center
  margin-top: 80px
</style>
