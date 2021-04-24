<template>
  <div class='issue'>
    TODO: Issue {{ id }}
  </div>
</template>

<script>
export default {
  computed: {
    id() { return parseInt(this.$route.params.id) || 0; },
  },
  methods: {
  }
}
</script>

<style scoped lang='sass'>
.issue
  position: absolute
  left: 0
  top: 0
  width: 100px
  height: 100px
  z-index: 1
  background-color: #fff
</style>
