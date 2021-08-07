<template>
  <Modal class='right-side'>
    <div class='notes'>
      <div class='note'>
        TODO: Notes
      </div>
      <div>MORE</div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/modal'

export default {
  components: {
    Modal
  },
  props: {},
  computed: {
    boardId() { return parseInt(this.$route.params.id); }
  },
  methods: {
    close() {
      this.$router.push({ name: 'board', id: this.boardId });
    }
  }
}
</script>

<style scoped lang='sass'>
.notes
  box-sizing: border-box
  height: calc(100vh - 36px) // 36px - top menu height
  overflow-y: scroll
  padding: 8px

.note
  background-color: #fff
  height: 2200px
  width: 200px

.right-side
  background-color: #283593
  border-radius: 0
  box-shadow: none
</style>
