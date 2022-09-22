<template>
  <div
    v-bind='$attrs'
    class='icon'
    :class='name'
  />
</template>

<script>
export default {
  props: {
    name: { type: String, required: true }
  }
}
</script>

<style scoped lang='sass'>
.icon
  background-position: center
  background-repeat: no-repeat
  cursor: pointer
  height: 12px
  padding: 6px
  width: 12px

  &:hover
    opacity: 0.7

  &:active
    opacity: 1.0

  &.edit
    background-image: url('../../assets/icons/issue/edit.svg')

  &.close
    background-image: url('../../assets/icons/issue/x_close.svg')

  &.gear
    background-size: contain
    background-image: url('../../assets/icons/issue/gear.svg')

  &.dots
    background-image: url('../../assets/icons/issue/dots.svg')
</style>
