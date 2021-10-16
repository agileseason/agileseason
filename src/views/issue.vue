<template>
  <Modal class='right-side'>
    <IssueShow
      :issue='currentIssue || unsyncedIssue'
      @close='closeIssue'
    />
  </Modal>
</template>

<script>
import IssueShow from '@/components/board/issue_show.vue';
import Modal from '@/components/modal.vue'
import { get } from 'vuex-pathify';

export default {
  components: {
    IssueShow,
    Modal
  },
  props: {},
  computed: {
    currentIssue: get('board/currentIssue'),
    issueId() { return parseInt(this.$route.params.issueId); },
    boardId() { return parseInt(this.$route.params.id); },
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
</style>
