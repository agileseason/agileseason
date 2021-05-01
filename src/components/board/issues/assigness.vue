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

// TODO:
// [+] 1. Отобразить назначенных на доске (10 максимум)
// 2. Отобразить назначенных в списке на промсмотре issue и на новом тикете
// 3. Быстраяя ссылка для назначения себя на просмотре и на новом тикете
// 4. Попап для назначения нескольких на просмотре и на новом тикете
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
