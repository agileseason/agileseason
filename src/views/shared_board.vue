<template>
  <Menu
    title='TODO: board name'
    username='TODO: authour'
  />
  <div>{{ token }}</div>
</template>

<script>
import Menu from '@/components/menu/top_shared';

export default {
  components: {
    Menu
  },
  data: () => ({
  }),
  computed: {
    // token: get('user/token'),
    // username: get('user/username'),
    // isSignedIn: get('user/isSignedIn'),
    token() { return this.$route.params.token; }
  },
  methods: {
  }
}
</script>

<style scoped lang='sass'>
</style>
