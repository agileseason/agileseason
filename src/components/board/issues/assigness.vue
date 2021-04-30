<template>
  <div class='assigness'>
    <label class='label active' @click='openAssigness'>
      <span>Assigness</span>
      <ButtonIcon name='gear' style='float: right; padding: 0' />
    </label>
    TODO
  </div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon.vue'

export default {
  components: {
    ButtonIcon
  },
  methods: {
    openAssigness() {
      console.log('openAssigness');
    }
  }
}
</script>

<style scoped lang='sass'>
label.label
  align-items: center
  color: #283593
  display: flex
  font-weight: 700
  justify-content: space-between
  margin-bottom: 6px

  &.active
    cursor: pointer

    &:hover
      opacity: 0.7
</style>
