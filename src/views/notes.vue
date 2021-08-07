<template>
  <Modal class='right-side'>
    <div class='header'>
      <div class='title'>
        <span class='icon'/>
        Notes
      </div>
      <div @click='close' class='icon close'/>
    </div>
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
.header
  color: #fff
  font-size: 16px
  font-weight: 500
  height: 36px
  margin: 0px 8px
  display: flex
  align-items: center
  justify-content: space-between

  .icon
    background-image: url('../assets/icons/menu/note.svg')
    background-position: center
    background-repeat: no-repeat
    display: inline-block
    height: 28px
    width: 28px

  .title
    display: flex
    align-items: center

    .icon
      margin-right: 4px

  .close
    background-image: url('../assets/icons/menu/x-white.svg')
    border-radius: 4px
    cursor: pointer

    &:hover
      background-color: #5c6bc0

    &:active
      background-color: #303f9f

.notes
  box-sizing: border-box
  height: calc(100vh - 36px)
  overflow-y: scroll
  padding: 0 8px

.note
  background-color: #fff
  height: 2200px
  border-radius: 3px
  padding: 6px 8px

.right-side
  background-color: #283593
  border-radius: 0
  box-shadow: none
</style>
