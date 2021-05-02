<template>
  <div class='select' v-bind='$attrs'>
    <div class='title'>{{ title }}</div>
    <div class='body'>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true }
  }
}
</script>

<style scoped lang='sass'>
.select
  box-sizing: border-box
  border: 1px solid #c5cae9
  border-radius: 4px
  background-color: #e8eaf6
  z-index: 2

.title
  color: #5c6bc0
  font-weight: 500
  border-bottom: 1px solid #c5cae9
  padding-bottom: 8px
  font-size: 12px
  padding: 8px

.body
</style>
