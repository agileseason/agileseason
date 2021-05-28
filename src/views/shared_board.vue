<template>
  <div>{{ token }}</div>
</template>

<script>

export default {
  components: {
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
