<template>
  <input
    v-bind='$attrs'
    type='text'
    :value='modelValue'
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped lang='sass'>
input
  background-color: #c5cae9
  border-radius: 3px
  border: 1px solid #c5cae9
  box-sizing: border-box
  color: #1a237e
  font-size: 16px
  font-weight: 300
  height: 28px
  letter-spacing: 0.4px
  margin-bottom: 20px
  padding: 0 6px

  &::placeholder
    color: #7986cb
    opacity: 1
  &:-ms-input-placeholder
    color: #7986cb
  &::-ms-input-placeholder
    color: #7986cb
</style>
