<template>
  <div class='select'>
    {{ name }}
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'BoardSelect',
  props: {
    id: { type: Number, required: false, default: 0 },
  },
  data: () => ({
    isExpanded: false
  }),
  computed: {
    isLoading: get('user/isLoading'),
    boards: get('user/boards'),
    name() {
      if (this.board != null) { return this.board.name; }
      if (this.isLoading) { return 'Loading...'; }
      return 'Unknown';
    },
    board() {
      return this.boards.find(v => v.id === 1);
    }
  },
  async created() {
    await this.fetchProfile();
  },
  methods: {
    ...call([
      'user/fetchProfile'
    ])
  }
};
</script>

<style scoped lang='sass'>
.select
  font-weight: 600
  line-height: 36px
  color: #FFF
  display: inline-block
</style>
