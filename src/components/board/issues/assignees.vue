<template>
  <div class='assignees'>
    <label class='label active' @click='openAssignees'>
      <span>Assignees</span>
      <ButtonIcon name='gear' style='float: right; padding: 0' />
    </label>
    <div
      v-for='(assignee, $index) in assignees'
      :key='$index'
      :title='assignee.url'
      class='assignee'
    >
      <img class='avatar' :src='assignee.avatarUrl' />
      <span class='login'>{{ assignee.login }}</span>
    </div>
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
  props: {
    assignees: { type: Array, required: true }
  },
  methods: {
    openAssignees() {
      console.log('openAssignees');
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

.assignee
  display: flex
  align-items: center

  .avatar
    border-radius: 11px
    height: 22px
    margin-right: 4px
    margin-top: 2px
    width: 22px

  .login
    font-size: 14px
    font-weight: 500
</style>
