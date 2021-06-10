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
        <ButtonIcon name='dots' @click='openSettings' />
        <Select v-if='isSettingsOpen' class='select-settings'>
          <div class='item' @click='replyComment'>Quote reply</div>
          <div class='item' @click='editComment'>Edit</div>
          <div class='item' @click='deleteComment'>Delete</div>
        </Select>
      </div>

      <div class='text markdown-body' v-html='markdown(body)'/>
    </div>

    <div v-if='isSettingsOpen' class='select-overlay' @click.self='closeSettings' />
  </div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Select from '@/components/select';

const marked = require('marked');

export default {
  props: {
    id: { type: [String, Number], required: true },
    author: { type: Object, required: true },
    createdAt: { type: String, required: true },
    createdAgo: { type: String, required: true },
    body: { type: String, required: true }
  },
  components: {
    ButtonIcon,
    Select
  },
  data: () => ({
    isSettingsOpen: false
  }),
  methods: {
    openSettings() { this.isSettingsOpen = true; },
    closeSettings() { this.isSettingsOpen = false; },
    editComment() {
      console.log('edit');
      this.isSettingsOpen = false;
    },
    replyComment() {
      console.log('reply');
      this.isSettingsOpen = false;
    },
    deleteComment() {
      if (confirm('Are you sure you want to delete this?')) {
        this.isSettingsOpen = false;
        console.log('TODO: Delete comment - ' + this.id);
      }
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
.select-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

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
      align-items: flex-start
      display: flex
      justify-content: space-between
      margin-bottom: 2px
      min-height: 24px
      position: relative

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

.select-settings
  position: absolute
  z-index: 2
  right: 0
  top: 32px

  .item
    cursor: pointer
    padding: 8px 10px

    &:hover
      background-color: #c5cae9

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9
</style>
