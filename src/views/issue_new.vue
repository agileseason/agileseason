<template>
  <Modal>
    <IssueNew
      :columnId='columnId'
      @close='close'
    />
  </Modal>
</template>

<script>
import IssueNew from '@/components/board/issue_new.vue';
import Modal from '@/components/modal.vue'

export default {
  components: {
    IssueNew,
    Modal
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
</style>
