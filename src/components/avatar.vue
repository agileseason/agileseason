<template>
  <img
    v-bind='$attrs'
    class='assignee'
    :class="{ 'small': isSmall }"
    :src='avatarUrl'
    :title='login'
  />
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    login: { type: String, default: '' },
    avatarUrl: { type: String, default: null },
    isSmall: { type: Boolean, default: false }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.assignee
  display: inline-block
  vertical-align: bottom
  border-radius: 50%
  height: 22px
  margin: 2px 0 0 4px
  width: 22px

  &.small
    height: 16px
    margin: 0
    width: 16px
</style>
