<template>
  <div class='comment' :class="{ 'disabled': isDeleting }">
    <img class='avatar' :src='author.avatarUrl' />

    <div v-if='!isEdit' class='content'>
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
          <div class='item danger' @click='deleteComment'>Delete</div>
        </Select>
      </div>

      <div class='text markdown-body' v-html='markdown(body)'/>
    </div>
    <MarkdownEditor
      v-if='isEdit'
      v-model='newComment'
      :assignable-users='assignableUsers'
      :mention-position-top=30
      :mention-position-left=30
      class='content'
    >
      <template #actions>
        <Button
          type='outline'
          text='Cancel'
          @click='cancel'
        />
        <Button
          type='indigo'
          text='Update comment'
          :isLoading='isSubmitting'
          @click='update'
        />
      </template>
    </MarkdownEditor>

    <div v-if='isSettingsOpen' class='select-overlay' @click.self='closeSettings' />
  </div>
</template>

<script>
import Button from '@/components/buttons/button'
import ButtonIcon from '@/components/buttons/icon'
import MarkdownEditor from '@/components/board/issues/markdown_editor'
import Select from '@/components/select';
import { call } from 'vuex-pathify';

const marked = require('marked');

export default {
  props: {
    id: { type: [String, Number], required: true },
    author: { type: Object, required: true },
    createdAt: { type: String, required: true },
    createdAgo: { type: String, required: true },
    body: { type: String, required: true },
    assignableUsers: { type: Array, required: true }
  },
  components: {
    Button,
    ButtonIcon,
    MarkdownEditor,
    Select
  },
  emits: ['reply'],
  data: () => ({
    newComment: '',
    isSettingsOpen: false,
    isEdit: false,
    isSubmitting: false,
    isDeleting: false
  }),
  computed: {
    bodyReply() {
      return this.body.replace(/^/g, '> ').replace(/\n/g, "\n> ");
    }
  },
  methods: {
    ...call([
      'issue/destroyComment'
    ]),
    openSettings() { this.isSettingsOpen = true; },
    closeSettings() { this.isSettingsOpen = false; },
    editComment() {
      this.isSettingsOpen = false;
      this.isEdit = true;
    },
    replyComment() {
      this.isSettingsOpen = false;
      this.$emit('reply', this.bodyReply);
    },
    update() {
      console.log('update');
      this.isEdit = false;
    },
    cancel() {
      this.isEdit = false;
    },
    async deleteComment() {
      if (this.isDeleting) { return; }

      if (confirm('Are you sure you want to delete this?')) {
        this.isSettingsOpen = false;
        this.isDeleting = true;
        await this.destroyComment({ id: this.id });
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

  &.disabled
    opacity: 0.5

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

// TODO: Remove duplications (see board/column.vue)
.select-settings
  position: absolute
  z-index: 2
  right: 0
  top: 32px
  overflow: hidden

  .item
    cursor: pointer
    padding: 8px 10px

    &.danger
      color: #d73a49

      &:hover
        background-color: #d73a49
        color: #fff

    &:hover
      background-color: #c5cae9

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9

.button + .button
  margin-left: 16px
</style>
