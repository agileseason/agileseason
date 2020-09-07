<template>
  <div class='repository'>
    <img :src='avatarUrl' />
    <span class='login'>{{ name }}</span>
    <span class='icon' />
  </div>
</template>

<script>
export default {
  name: 'Repository',
  props: {
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
.repository
  border-radius: 3px
  border: 1px solid #E0E0E0
  color: #424242
  cursor: pointer
  height: 34px
  position: relative
  text-align: left

  &:hover
    background-color: #F5F5F5
    color: #303F9F

  .icon
    background-image: url('../../assets/icons/right.svg')
    background-position: right
    background-repeat: no-repeat
    background-size: 10px
    display: inline-block
    height: 34px
    position: absolute
    right: 8px
    width: 10px

.login
  display: inline-block
  font-size: 14px
  line-height: 32px
  vertical-align: top

img
  border-radius: 12px
  height: 24px
  width: 24px
  margin: 5px 6px
</style>
