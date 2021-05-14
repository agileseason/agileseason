<template>
  <div class='dialog-overlay' @click.self='close' />
  <div class='dialog' v-bind='$attrs'>
    <slot />
    <div class='actions'>
      <slot name='actions' />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // title: { type: String, required: true }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped lang='sass'>
.dialog
  background-color: #3f51b5
  border-radius: 3px
  border: 1px solid #3f51b5
  color: #fff
  position: absolute
  text-align: left
  width: 100%
  z-index: 2

  .actions
    border-top: 1px solid #7986cb
    text-align: right
    padding: 8px

.dialog-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1
</style>
