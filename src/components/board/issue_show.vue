<template>
  <div v-if='isNotFound' class='issue'>
    <div class='issue-header'>
      <div class='close' @click='close' />
    </div>
    <p class='not-found'>Couldn't found issue</p>
  </div>
  <div v-else class='issue'>
    <div class='issue-header'>
      <span v-if='state' class='state' :class='{"closed": isClosed}'>{{ state }}</span>
      <span class='repo'>{{ repositoryName }}</span>
      <div class='close' @click='close' />
    </div>
    <div class='issue-body'>
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
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader';
import { get, call } from 'vuex-pathify';

export default {
  name: 'IssueShow',
  components: {
    Loader
  },
  props: {
    issue: { type: Object, required: false },
  },
  data: () => ({}),
  computed: {
    isLoading: get('issue/isLoading'),
    isLoaded: get('issue/isLoaded'),
    isCommentLoading: get('issue/isCommentLoading'),
    isCommentLoaded: get('issue/isCommentLoaded'),
    isNotFound: get('issue/isNotFound'),
    origUrl: get('issue/url'),
    origRepositoryName: get('issue/repositoryName'),
    origTitle: get('issue/title'),
    origBody: get('issue/body'),
    origIsClosed: get('issue/isClosed'),
    origCreatedAt: get('issue/createdAt'),
    origCreatedAgo: get('issue/createdAgo'),
    origAuthor: get('issue/author'),
    origComments: get('issue/comments'),
    id() { return parseInt(this.$route.params.issueId); },
    number() { return parseInt(this.$route.params.issueNumber); },
    url() { return this.issue.url || this.origUrl; },
    repositoryName() { return this.issue.repositoryName || this.origRepositoryName; },
    title() {
      return this.isLoaded ? this.origTitle : this.issue.title;
    },
    isClosed() {
      return this.isLoaded ? this.origIsClosed : this.issue.isClosed;
    },
    isBodyEmpty() { return this.origBody == null || this.origBody.length === 0; },
    state() {
      if (this.isClosed == null) { return null; }
      return this.issue.isClosed ? 'closed' : 'open';
    }
  },
  async created() {
    if (this.id) {
      await this.fetch({ id: this.id });
      this.fetchComments({ id: this.id });
    }
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
.not-found
  font-size: 24px
  font-weight: 600
  margin: 40px 0
  text-align: center
  width: 100%

.issue-header
  border-bottom: 1px solid #c5cae9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px
  position: relative

  .state
    background-color: #22863a
    background-image: url('../../assets/icons/issue/white_open.svg')
    background-position-y: center
    background-position-x: 4px
    background-repeat: no-repeat
    border-radius: 12px
    box-sizing: border-box
    color: #fff
    display: inline-block
    font-size: 12px
    height: 24px
    line-height: 20px
    margin-right: 8px
    padding: 2px 8px 2px 24px
    vertical-align: top

    &.closed
      background-color: #d73a49
      background-image: url('../../assets/icons/issue/white_closed.svg')

  .repo
    font-weight: 500
    line-height: 22px

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
  padding: 12px 14px

  .title
    font-size: 20px
    font-weight: 500
    margin-bottom: 12px

    a
      color: #2196f3
      font-weight: 400

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
      border-radius: 2px
      border: 1px solid #e8eaf6
      margin-left: 50px
      padding: 10px

      a.author
        display: inline-block
        color: #283593
        font-size: 13px
        font-weight: 600
        margin-bottom: 14px
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
</style>
