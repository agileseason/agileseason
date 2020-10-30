<template>
  <div class='issue'>
    <div class='issue-header'>
      <span class='icon' />
      <span class='title'>New Issue</span>
      <div class='close' @click='close' />
    </div>

    <!--div class='issue-body'>
      <div class='title'>
        {{ title }}&nbsp;<a :href='url'>#{{ number }}</a>
      </div>
      <Loader v-if='isLoading' />
      <div v-if='!isLoading' class='main-comment comment'>
        <img class='avatar' :src='origAuthor.avatarUrl' />

        <div class='content'>
          <a class='author' :href='origAuthor.url'>{{ origAuthor.login }}</a>
          <span class='ago' :title='origCreatedAt'>
            commented {{ origCreatedAgo }}
          </span>

          <div v-if='isBodyEmpty' class='text empty'>No description provided</div>
          <div v-else class='text'>
            {{ origBody }}
          </div>
        </div>
      </div>

      <Loader v-if='isCommentLoading' />
      <div v-if='isCommentLoaded' class='comments'>
        <div v-for='item in origComments' :key='item.id' class='comment'>
          <img class='avatar' :src='item.author.avatarUrl' />

          <div class='content'>
            <a class='author' :href='item.author.url'>{{ item.author.login }}</a>
            <span class='ago' :title='item.createdAt'>
              commented {{ item.createdAgo }}
            </span>

            <div class='text'>
              {{ item.body }}
            </div>
          </div>
        </div>
      </div>
    </div-->
  </div>
</template>

<script>
// import { get, call } from 'vuex-pathify';
import { call } from 'vuex-pathify';

export default {
  name: 'IssueNew',
  components: {},
  props: {},
  data: () => ({}),
  computed: {
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
    close() { this.$emit('close'); }
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
</style>
