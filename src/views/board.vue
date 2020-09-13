<template>
  <TopMenu />

  <div class='board'>
    <div class='columns'>
      <ColumnNew @submit='createNewColumn' />
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/menu/top.vue';
import ColumnNew from '@/components/board/column_new.vue';
import { get, call } from 'vuex-pathify';

export default {
  name: 'Board',
  components: {
    TopMenu,
    ColumnNew
  },
  data: () => ({
    isSubmittingNewColumn: false,
    columns: [
      { id: 1, name: 'Todo' },
      { id: 2, name: 'In progress' }
    ]
  }),
  computed: {
    token: get('user/token')
  },
  async created() {
    await this.fetchProfileLazy();
  },
  methods: {
    ...call([
      'user/fetchProfileLazy'
    ]),
    async createNewColumn(name) {
      if (this.isSubmittingNewColumn) { return; }
      this.isSubmittingNewColumn = true;
      await this.$nextTick(() => this.isSubmittingNewColumn = false);
      console.log('new column: ' + name);
    }
  }
}
</script>

<style scoped lang='sass'>
.board
  padding: 8px 8px 0px 8px

  .columns
    .column
</style>
