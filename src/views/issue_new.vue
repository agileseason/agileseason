<template>
  <div class='modal is-expanded'>
    <IssueNew
      :columnId='columnId'
      @close='close'
    />
  </div>
</template>

<script>
import IssueNew from '@/components/board/issue_new.vue';

export default {
  components: {
    IssueNew
  },
  props: {},
  computed: {
    boardId() { return parseInt(this.$route.params.id); },
    columnId() { return parseInt(this.$route.params.columnId); }
  },
  methods: {
    close() {
      this.$router.push({ name: 'board', id: this.boardId });
    }
  }
}
</script>

<style scoped lang='sass'>
.modal
  background-color: #fff
  min-height: 500px
  position: absolute
  top: 36px
  left: 50%
  width: 80%
  max-width: 1280px
  z-index: 5
  box-shadow: 0px 6px 10px 0px #bdbdbd

  transform: translate(-50%, 2000px)

  &.slide-enter-to
    transform: translate(-50%, 0%)

  &.is-expanded:not(.slide-enter-active)
    transform: translateX(-50%)
</style>
