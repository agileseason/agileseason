<template>
  <textarea
    v-bind='$attrs'
    :value='modelValue'
    :placeholder='placeholder'
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    placeholder: { type: String, default: 'Leave a comment...' },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

<style scoped lang='sass'>
textarea
  border-radius: 3px
  border: 1px solid #c5cae9
  box-sizing: border-box
  font-size: 16px
  font-weight: 300
  margin-left: 50px
  padding: 8px
  width: calc(100% - 50px) // 100% - margin-left
  min-height: 200px
  resize: none

  &::placeholder
    color: #9fa8da
    opacity: 1
  &:-ms-input-placeholder
    color: #9fa8da
  &::-ms-input-placeholder
    color: #9fa8da
</style>
