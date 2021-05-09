<template>
  <div class='button'>
    <span class='icon' :class='icon' />
    {{ name }}
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    icon: { type: String, required: true }
  }
}
</script>

<style scoped lang='sass'>
.button
  align-items: center
  border-radius: 4px
  border: 1px solid #7986cb
  box-sizing: border-box
  color: #5C6BC0
  display: flex
  font-size: 11px
  height: 22px
  min-width: 60px
  padding: 4px

  &:hover
    background-color: #e8eaf6
    border: 1px solid #5c6bc0
    color: #3f51b5

  &:active
    border: 1px solid #9fa8da

.icon
  background-position: center
  background-repeat: no-repeat
  display: inline-block
  margin-right: 4px
  width: 16px
  height: 16px

  &.close
    background-image: url('../../../assets/icons/issue/indigo_close.svg')

  &.archive
    background-image: url('../../../assets/icons/issue/indigo_archive.svg')

.button + .button
  margin-left: 4px
</style>
