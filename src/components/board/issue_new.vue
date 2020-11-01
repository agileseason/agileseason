<template>
  <div class='issue'>
    <div class='issue-header'>
      <span class='icon' />
      <span class='title'>New Issue</span>
      <div class='close' @click='close' />
    </div>
    <div class='issue-body'>
      <div class='left'>
        <img class='avatar' :src='avatarUrl' />

        <input type='text' class='title' v-model='title' placeholder='Title' />
        <textarea
          class='body'
          v-model='body'
          placeholder='Leave a comment...'
        />

        <div class='actions'>
          <Button text='Submit new issue' @click='submit' :is-loading='isSubmitting' />
        </div>
      </div>

      <div class='right'>
        TODO
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'IssueNew',
  components: {
    Button
  },
  props: {
    columnId: { type: Number, required: true }
  },
  data: () => ({
    title: '',
    body: '',

    isSubmitting: false
  }),
  computed: {
    username: get('user/username'),
    avatarUrl: get('user/avatarUrl'),
    // isLoading: get('issue/isLoading'),
    // isLoaded: get('issue/isLoaded'),
    // isCommentLoading: get('issue/isCommentLoading'),
    // isCommentLoaded: get('issue/isCommentLoaded'),
    // origTitle: get('issue/title'),
    // origBody: get('issue/body'),
    // origCreatedAt: get('issue/createdAt'),
    // origCreatedAgo: get('issue/createdAgo'),
    // origAuthor: get('issue/author'),
    // origComments: get('issue/comments'),
    // id() { return this.issue?.id; },
    // number() { return this.issue?.number; },
    // url() { return this.issue?.url; },
    // repositoryName() { return this.issue?.repositoryName; },
    // title() {
    //   return this.isLoaded ?
    //     this.origTitle :
    //     this.issue?.title;
    // },
    // isClosed() { return this.issue?.isClosed; },
    // isBodyEmpty() { return this.origBody == null || this.origBody.length === 0; },
    // state() { return this.issue?.isClosed ? 'closed' : 'open'; },
  },
  created() {
  },
  methods: {
    ...call([
      'issue/fetch',
      'issue/fetchComments'
    ]),
    close() { this.$emit('close'); },
    submit() {
      this.isSubmitting = true;
      console.log('submit new issue');
      console.log(this.title + ' ' + this.body);
    }
  }
}
</script>

<style scoped lang='sass'>
.issue-header
  border-bottom: 1px solid #C5CAE9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px
  position: relative

  .icon
    background-image: url('../../assets/icons/issue/green_open.svg')
    background-position-y: center
    background-repeat: no-repeat
    display: inline-block
    height: 24px
    margin-right: 10px
    width: 16px

  .title
    font-weight: 500
    line-height: 24px
    vertical-align: top

  .close
    background-image: url('../../assets/icons/issue/x_close.svg')
    background-position: center
    background-repeat: no-repeat
    cursor: pointer
    float: right
    height: 10px
    padding: 6px
    width: 10px

    &:hover
      opacity: 0.7

    &:active
      opacity: 0.9

.issue-body
  position: relative

  .avatar
    width: 40px
    height: 40px
    border-radius: 20px
    background: #EEE
    position: absolute
    left: 14px
    top: 14px

  input.title
    border-radius: 3px
    border: 1px solid #C5CAE9
    box-sizing: border-box
    font-size: 20px
    font-weight: 300
    height: 34px
    margin: 16px 0 14px 62px
    padding: 0 8px
    width: calc(100% - 62px) // 100% - margin-left

    &::placeholder
      color: #7986CB
      opacity: 1
    &:-ms-input-placeholder
      color: #7986CB
    &::-ms-input-placeholder
      color: #7986CB

  textarea.body
    border-radius: 3px
    border: 1px solid #C5CAE9
    box-sizing: border-box
    font-size: 16px
    font-weight: 300
    margin-left: 62px
    padding: 8px
    width: calc(100% - 62px) // 100% - margin-left
    min-height: 200px
    resize: none

    &::placeholder
      color: #9FA8DA
      opacity: 1
    &:-ms-input-placeholder
      color: #9FA8DA
    &::-ms-input-placeholder
      color: #9FA8DA

  .left,
  .right
    display: inline-block

  .left
    width: calc(100% - 180px)

  .right
    box-sizing: border-box
    margin-top: 16px
    padding: 0 14px 0 30px
    vertical-align: top
    width: 180px

  .actions
    text-align: right
    margin-top: 12px

    .button
      min-width: 170px
</style>
