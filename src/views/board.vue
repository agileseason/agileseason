<template>
  <TopMenu />

  <div class='board'>
    <Loader v-if='isLoading' :title='boardName' />
    <div v-if='isNotFound'>Not Found!</div>
    <div v-if='isLoaded' class='columns' :style='widthStyles'>
      <Column
        v-for='(column, $index) in sortedColumns'
        :key='column.id'
        v-bind='column'
        :column-index='$index'
        :is-last-column='$index === columns.length - 1'
      />
      <ColumnNew v-if='isOwner' @submit='createNewColumn' />
    </div>
  </div>

  <!-- variant I (center) -->
  <div
    class='modal-overlay'
    v-if='isLoaded && !isModalRight'
    v-show='isModalOpen'
    @click.self='backToBoard'
  >
    <router-view v-slot='{ Component }'>
      <transition name='slide' :duration='200'>
        <component :is='Component' />
      </transition>
    </router-view>
  </div>
  <!-- variant II (right) -->
  <div
    v-if='isLoaded && isModalRight'
    v-show='isModalOpen'
  >
    <div
      class='modal-overlay-blank'
      @click.self='backToBoard'
    />
    <router-view v-slot='{ Component }'>
      <transition name='slide' :duration='200'>
        <component :is='Component' />
      </transition>
    </router-view>
  </div>
</template>

<script>
import Column from '@/components/board/column.vue';
import ColumnNew from '@/components/board/column_new.vue';
import Loader from '@/components/loader';
import TopMenu from '@/components/menu/top.vue';
import { columnWidthStyles } from '@/utils/board_helper';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Board',
  components: {
    Column,
    ColumnNew,
    Loader,
    TopMenu
  },
  data: () => ({
    refreshDelaySec: 45,
    refreshInterval: null,
    isSubmittingNewColumn: false
  }),
  computed: {
    token: get('user/token'),
    boards: get('user/boards'),
    issueModalStyle: get('user/issueModalStyle'),
    columns: get('board/columns'),
    cacheKey: get('board/cacheKey'),
    isOwner: get('board/isOwner'),
    isLoaded: get('board/isLoaded'),
    isLoading: get('board/isLoading'),
    isNotFound: get('board/isNotFound'),
    loadedAt: get('board/loadedAt'),
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    },
    boardId() { return parseInt(this.$route.params.id) || 0; },
    boardName() {
      return this.boards.find(v => v.id === this.boardId)?.name || 'Board';
    },
    widthStyles() {
      if (this.isLoading) { return {}; }
      return columnWidthStyles(this.columns.length + 1);
    },
    isModalOpen() {
      return this.$route.name === 'issue' ||
        this.$route.name === 'issue_new';
    },
    isModalRight() { return this.issueModalStyle === 'right'; }
  },
  async created() {
    await this.fetchProfileLazy();
    await this.fetch({ id: this.boardId });
  },
  watch: {
    boardId(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      if (newValue == null || isNaN(newValue)) { return; }
      if (this.refreshInterval) { clearInterval(this.refreshInterval); }
      this.fetch({ id: this.boardId });
      this.refreshBoard();
    }
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'board/createColumn',
      'board/setCurrentIssue',
      'board/fetch',
      'board/silentFetch',
      'board/fetchBoardCacheKey'
    ]),
    async createNewColumn(name) {
      if (this.isSubmittingNewColumn) { return; }
      this.isSubmittingNewColumn = true;
      await this.createColumn({ name });
      this.isSubmittingNewColumn = false;
    },
    backToBoard() {
      this.setCurrentIssue({ issue: {} });
      this.$router.push({ name: 'board', id: this.boardId });
    },
    refreshBoard() {
      this.refreshInterval = setInterval(async () => {
        if (this.isNotFound) return;
        if (this.loadedAt == null) return;

        const now = new Date();
        const planLoadedAt = now.setSeconds(now.getSeconds() - this.refreshDelaySec + 1);
        if (this.loadedAt > planLoadedAt) return;

        const key = await this.fetchBoardCacheKey({ id: this.boardId });
        if (key !== this.cacheKey) {
          this.silentFetch({ id: this.boardId });
        }
      }, this.refreshDelaySec * 1000);
    }
  },
  mounted() {
    this.refreshBoard();
  },
  beforeUnmount() {
    if (this.refreshInterval) { clearInterval(this.refreshInterval); }
  },
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px
  overflow-x: scroll
</style>
