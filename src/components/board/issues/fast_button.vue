<template>
  <div class='button'>
    <span class='icon' :class='icon' />
    <div v-if='isSubmitting' class='loader' />
    <span v-else>
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    isSubmitting: { type: Boolean, default: false }
  }
}
</script>

<style scoped lang='sass'>
.button
  align-items: center
  border-radius: 4px
  border: 1px solid rgba(26, 35, 126, 0.6)
  box-sizing: border-box
  color: rgb(26, 35, 126, 0.7)
  display: flex
  font-size: 11px
  height: 22px
  min-width: 60px
  padding: 4px

  &:hover
    background-color: rgb(26, 35, 126, 0.1)
    border: 1px solid rgb(26, 35, 126, 0.7)
    color: #3f51b5

  &:active
    border: 1px solid rgb(26, 35, 126, 0.3)

.button + .button
  margin-left: 4px

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

.loader
  background-image: url('../../../assets/button/indigo_loader.svg')
  background-repeat: no-repeat
  background-size: contain
  height: 22px
  width: 30px
</style>
