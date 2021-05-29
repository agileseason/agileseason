<template>
  <div class='menu'>
    <div class='note'>
      Powered by <a href='/'>Agile Season</a>
    </div>
    <div class='title'>
      {{ title }}
    </div>
    <div v-if='username' class='author'>
      Shared by <a :href='githubLink'>blackchestnut</a>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    title: { type: String, default: null },
    username: { type: String, default: null }
  },
  computed: {
    githubLink() {
      return `https://github.com/${this.username}`;
    }
  }
};
</script>

<style scoped lang='sass'>
.menu
  align-items: center
  background-color: #3f51b5
  display: flex
  height: 36px
  justify-content: space-between
  padding: 0 14px

.title,
a
  color: #fff
  font-weight: 500
  line-height: 36px

a:hover
  text-decoration: underline

.note,
.author
  color: #fff
  font-weight: 300
  line-height: 36px

  .brand
    font-weight: 500
</style>
