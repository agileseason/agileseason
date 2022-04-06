<template>
  <Modal class='search-modal'>
    <GlobalEvents
      @keyup.prevent.down.exact='down'
      @keyup.prevent.up.exact='up'
      @keyup.enter='selectBoard'
    />
    <div
      v-for='(board, $index) in boards'
      :key='board.id'
      class='board'
      :class="{ 'selected': $index === selectedIndex }"
      @click='goto(board)'
      @mouseenter='hover($index)'
    >
      <div class='name'>
        {{ board.name }}
      </div>
      <!--div v-if='$index === selectedIndex' class='hint'>
        Enter
      </div-->
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/modal.vue'
import { GlobalEvents } from 'vue-global-events';
import { call, get } from 'vuex-pathify';

export default {
  components: {
    GlobalEvents,
    Modal
  },
  data: () => ({
    selectedIndex: undefined
  }),
  props: {},
  computed: {
    boards: get('user/boards'),
    boardId() { return parseInt(this.$route.params.id); }
  },
  methods: {
    ...call([
      'board/fetch'
    ]),
    goto({ id }) {
      this.$router.replace({ name: 'board', params: { id } });
    },
    selectBoard() {
      if (this.selectedIndex === undefined) { return; }
      const board = this.boards[this.selectedIndex];
      if (board == null) { return; }
      this.goto(board);
    },
    hover(index) {
      this.selectedIndex = index;
    },
    up() {
      if (
        this.selectedIndex === undefined ||
        (this.selectedIndex - 1) < 0
      ) {
        this.selectedIndex = this.boards.length - 1;
      } else {
        this.selectedIndex -= 1;
      }
    },
    down() {
      if (
        this.selectedIndex === undefined ||
        (this.selectedIndex + 1) >= this.boards.length
      ) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex += 1;
      }
    }
  }
}
</script>

<style scoped lang='sass'>
.search-modal
  border-radius: 20px
  height: auto
  margin-top: 20px
  max-width: 1000px
  min-height: auto
  overflow: hidden
  width: 40%
  box-sizing: border-box

  .board
    cursor: pointer
    padding: 14px 20px
    display: flex
    justify-content: space-between

    //&:hover
    &.selected
      background-color: #e8eaf6

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9

    .name
      font-weight: 500
      color: #212121

    .hint
      color: #9fa8da
      font-weight: 200
</style>
