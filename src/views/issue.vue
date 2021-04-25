<template>
  <div class='modal is-expanded'>
    <IssueShow
      :issue='currentIssue || unsyncedIssue'
      @close='closeIssue'
    />
  </div>
</template>

<script>
import IssueShow from '@/components/board/issue_show.vue';
import { get } from 'vuex-pathify';

export default {
  components: {
    IssueShow
  },
  props: {},
  computed: {
    currentIssue: get('board/currentIssue'),
    issueId() { return parseInt(this.$route.params.issueId) || 0; },
    boardId() { return parseInt(this.$route.params.id) || 0; },
    unsyncedIssue() {
      return { id: this.issueId };
    }
  },
  methods: {
    closeIssue() {
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
  box-shadow: 0px 6px 10px 0px #BDBDBD

  transform: translate(-50%, 2000px)

  &.slide-enter-to
    transform: translate(-50%, 0%)

  &.is-expanded:not(.slide-enter-active)
    transform: translateX(-50%)
</style>
