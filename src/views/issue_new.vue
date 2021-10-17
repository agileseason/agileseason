<template>
  <Modal :class='modalClasses'>
    <IssueNew
      :columnId='columnId'
      @close='close'
    />
  </Modal>
</template>

<script>
import IssueNew from '@/components/board/issue_new';
import Modal from '@/components/modal'
import { get } from 'vuex-pathify';

export default {
  components: {
    IssueNew,
    Modal
  },
  props: {},
  computed: {
    issueModalStyle: get('user/issueModalStyle'),
    boardId() { return parseInt(this.$route.params.id); },
    columnId() { return parseInt(this.$route.params.columnId); },
    modalClasses() {
      if (this.issueModalStyle !== 'right') { return null; }
      return 'right-side';
    },
  },
  methods: {
    close() {
      this.$router.push({ name: 'board', id: this.boardId });
    }
  }
}
</script>

<style scoped lang='sass'>
</style>
