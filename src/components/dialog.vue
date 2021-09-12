<template>
  <div class='dialog-overlay' @click.self='close' />
  <div class='dialog' v-bind='$attrs'>
    <div v-if='title' class='title'>{{ title }}</div>
    <slot />
    <div class='actions'>
      <slot name='actions' />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: null }
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
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1)
  box-sizing: border-box
  color: #fff
  padding: 8px
  position: absolute
  text-align: left
  width: 100%
  z-index: 3 // z-index: 2 on the issue progress - https://github.com/agileseason/agileseason/issues/19

  .title
    color: #fff
    font-size: 14px
    font-weight: 500
    margin-bottom: 8px

  .actions
    align-items: center
    border-top: 1px solid #7986cb
    display: flex
    justify-content: flex-end
    padding-top: 8px

.dialog-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1
</style>
