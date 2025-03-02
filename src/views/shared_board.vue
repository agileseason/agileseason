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

    <!-- variant I (center) -->
    <div
      class='modal-overlay'
      v-if='true'
      v-show='isModalOpen'
      @click.self='backToBoard'
    >
      <router-view v-slot='{ Component }'>
        <transition name='slide' :duration='200'>
          <component :is='Component' />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import Column from '@/components/board/column.vue';
import Loader from '@/components/loader';
import Menu from '@/components/menu/top_shared';
import api from '@/api';
import { columnWidthStyles } from '@/utils/board_helper';

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
    token() { return this.$route.params.token; },
    isNotFound() { return !this.isLoading && this.board == null; },
    isFullScreen() { return !!this.$route.query.fullScreen; },
    boardName() { return this.board?.name; },
    boardOwner() { return this.board?.owner || {}; },
    widthStyles() {
      if (this.isLoading) { return {}; }
      if (this.board == null) { return {}; }
      return columnWidthStyles(this.board.columns.length);
    },
    isModalOpen() { return this.$route.name === 'sharedIssue'; },
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
