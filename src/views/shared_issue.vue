<template>
  <Modal :class='modalClasses'>
    <div>TODO</div>
    <!--IssueShow
      :issue='currentIssue || unsyncedIssue'
      @close='closeIssue'
    /-->
  </Modal>
</template>

<script>
// import IssueShow from '@/components/board/issue_show.vue';
import Modal from '@/components/modal.vue'
import { call, get } from 'vuex-pathify';

export default {
  components: {
    // IssueShow,
    Modal
  },
  props: {},
  computed: {
    currentIssue: get('board/currentIssue'),
    issueModalStyle: get('user/issueModalStyle'),
    issueId() { return parseInt(this.$route.params.issueId); },
    boardToken() { return parseInt(this.$route.params.token); },
    unsyncedIssue() {
      return { id: this.issueId };
    },
    modalClasses() {
      if (this.issueModalStyle !== 'right') { return null; }
      return 'right-side';
    },
  },
  methods: {
    ...call([
      'board/setCurrentIssue'
    ]),
    closeIssue() {
      this.setCurrentIssue({ issue: {} });
      this.$router.push({ name: 'shared_board', token: this.boardToken });
    }
  }
}
</script>

<style scoped lang='sass'>
</style>
