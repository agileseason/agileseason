<template>
  <Modal>
    <div>TODO: search</div>
  </Modal>
</template>

<script>
import Modal from '@/components/modal.vue'
import { call, get } from 'vuex-pathify';

export default {
  components: {
    Modal
  },
  props: {},
  computed: {
    currentIssue: get('board/currentIssue'),
    boardId() { return parseInt(this.$route.params.id); }
  },
  methods: {
    ...call([
      'board/setCurrentIssue'
    ]),
    closeIssue() {
      this.setCurrentIssue({ issue: {} });
      this.$router.push({ name: 'board', id: this.boardId });
    }
  }
}
</script>

<style scoped lang='sass'>
.test
  border-bottom: 1px solid #c5cae9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px
  position: relative
</style>
