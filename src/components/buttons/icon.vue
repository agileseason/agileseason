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
  },
  methods: {
    // click() {
    //   this.$emit('click');
    // }
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
    opacity: 0.9

  &.edit
    background-image: url('../../assets/icons/issue/edit.svg')

  &.close
    background-image: url('../../assets/icons/issue/x_close.svg')

  &.gear
    background-image: url('../../assets/icons/issue/gear.svg')
</style>
