<template>
  <div class='select' v-bind='$attrs'>
    <div v-if='title' class='title'>{{ title }}</div>
    <div class='body'>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: null }
  }
}
</script>

<style scoped lang='sass'>
.select
  background-color: #e8eaf6
  border-radius: 4px
  border: 1px solid #c5cae9
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1)
  box-sizing: border-box

.title
  border-bottom: 1px solid #c5cae9
  color: #5c6bc0
  font-size: 12px
  font-weight: 500
  padding-bottom: 8px
  padding: 8px
</style>
