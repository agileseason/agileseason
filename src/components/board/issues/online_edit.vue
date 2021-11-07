<template>
  <div class='online-edit'>
    <div class='button'>
      Assigness
      <span class='gear' />
    </div>
    <div class='button'>
      Labels
      <span class='gear' />
    </div>
    <div class='button'>
      Color
      <span class='gear' />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  computed: {},
  methods: {}
}
</script>

<style lang='sass'>
.online-edit
  position: absolute
  z-index: 4
  margin-left: 6px

  .button
    align-items: center
    background-color: #fff
    border-radius: 4px
    box-sizing: border-box
    color: #283593
    cursor: pointer
    display: flex
    height: 30px
    justify-content: space-between
    padding: 0 8px
    width: 178px

    &:not(.last-child)
      margin-bottom: 6px

    &:hover
      background-color: #E8EAF6

    &:active
      background-color: #fff

    .gear
      background-image: url('../../../assets/icons/issue/gear.svg')
      background-position: center
      background-repeat: no-repeat
      height: 12px
      width: 12px
</style>
