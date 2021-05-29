<template>
  <Menu
    :title='boardName'
    username='TODO: authour'
  />
  <Loader v-if='isLoading' />
  <div v-if='isNotFound'>Not found</div>
  <div v-if='board'>{{ token }}</div>
</template>

<script>
import Loader from '@/components/loader';
import Menu from '@/components/menu/top_shared';
import api from '@/api';

export default {
  components: {
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
    boardName() { return this.board?.name; }
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
</style>
