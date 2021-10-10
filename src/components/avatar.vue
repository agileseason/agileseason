<template>
  <img
    v-bind='$attrs'
    class='assignee'
    :src='avatarUrl'
    :title='login'
  />
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    login: { type: String, default: '' },
    avatarUrl: { type: String, default: null }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.assignee
  display: inline-block
  vertical-align: bottom
  border-radius: 11px
  height: 22px
  margin: 2px 0 0 4px
  width: 22px
</style>
