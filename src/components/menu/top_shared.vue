<template>
  <div class='menu'>
    <div class='note'>
      Powered by <a href='/'>Agile Season</a>
    </div>
    <div class='title'>
      {{ title }}
    </div>
    <div v-if='username' class='author'>
      Shared by&nbsp;<a :href='githubLink'>{{ username }}</a>
      <img
        v-if='avatarUrl'
        class='avatar'
        :src='avatarUrl'
        :title='username'
      />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    title: { type: String, default: null },
    username: { type: String, default: null },
    avatarUrl: { type: String, default: null },
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
  padding: 0 8px

.title,
a
  color: #fff
  font-weight: 500
  line-height: 36px

.title
  @media screen and (max-width: 511px)
    display: none

a:hover
  text-decoration: underline

.note
  color: #fff
  font-weight: 300
  line-height: 36px

  .brand
    font-weight: 500

  @media screen and (max-width: 511px)
    font-size: 12px

.author
  align-items: center
  color: #fff
  display: flex
  font-weight: 300
  line-height: 36px

  @media screen and (max-width: 511px)
    font-size: 12px

  .avatar
    vertical-align: bottom
    border-radius: 11px
    height: 22px
    margin-left: 6px
    width: 22px
</style>
