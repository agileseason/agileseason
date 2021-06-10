<template>
  <div class='comment'>
    <img class='avatar' :src='author.avatarUrl' />

    <div class='content'>
      <div class='header'>
        <div>
          <a class='author' :href='author.url'>{{ author.login }}</a>
          <span class='ago' :title='createdAt'>
            commented {{ createdAgo }}
          </span>
        </div>
        <ButtonIcon name='dots' @click='startEditComment' />
      </div>

      <div class='text markdown-body' v-html='markdown(body)'/>
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'

const marked = require('marked');

export default {
  props: {
    author: { type: Object, required: true },
    createdAt: { type: String, required: true },
    createdAgo: { type: String, required: true },
    body: { type: String, required: true }
  },
  components: {
    ButtonIcon
  },
  methods: {
    startEditComment() {
      console.log('startEditComment');
    },
    // https://marked.js.org/using_advanced#options
    markdown(text) {
      return marked(text, {
        breaks: true
      });
    }
  }
}
</script>

<style scoped lang='sass'>
.comment
  position: relative
  margin-bottom: 20px

  .avatar
    width: 40px
    height: 40px
    border-radius: 20px
    background: #eee
    position: absolute
    left: 0
    top: 0

  .content
    border-radius: 4px
    border: 1px solid #e8eaf6
    margin-left: 50px
    padding: 10px

    .header
      display: flex
      justify-content: space-between
      align-items: flex-start
      margin-bottom: 2px
      min-height: 24px

      a.author
        display: inline-block
        color: #283593
        font-size: 13px
        font-weight: 500
        cursor: pointer

        &:hover
          text-decoration: underline

      .ago
        margin-left: 2px
        color: #283593
        font-size: 13px
        font-weight: 400

    .text
      font-family: Roboto
      font-size: 14px
      font-style: normal
      font-weight: 400
      line-height: 18px
      letter-spacing: 0.012em

      &.empty
        color: #9e9e9e
        font-weight: 200
</style>
