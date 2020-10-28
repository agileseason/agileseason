<template>
  <div class='issue'>
    <div class='issue-header'>
      <span class='state' :class='{"closed": isClosed}'>{{ state }}</span>
      <span class='repo'>{{ repositoryName }}</span>
      <div class='close' @click='close' />
    </div>
    <div class='issue-body'>
      <div class='title'>
        {{ title }}&nbsp;<a :href='url'>#{{ number }}</a>
      </div>
      <Loader v-if='isLoading' />
      <div v-if='!isLoading' class='main-comment comment'>
        <div class='avatar' />
        <div class='text'>
          {{ origBody }}
        </div>
      </div>
      <div v-if='!isLoading' class='comments'>comments...</div>
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
    // id: { type: Number, required: false },
    // number: { type: Number, required: false },
    // title: { type: String, required: false },
    // url: { type: String, required: false }
  },
  data: () => ({}),
  computed: {
    isLoading: get('issue/isLoading'),
    isLoaded: get('issue/isLoaded'),
    // TODO: Add not found vue.
    isNotFound: get('issue/isNotFound'),
    origTitle: get('issue/title'),
    origBody: get('issue/body'),
    id() { return this.issue?.id; },
    number() { return this.issue?.number; },
    url() { return this.issue?.url; },
    repositoryName() { return this.issue?.repositoryName; },
    title() {
      return this.isLoaded ?
        this.origTitle :
        this.issue?.title;
    },
    isClosed() { return this.issue?.isClosed; },
    state() { return this.issue?.isClosed ? 'closed' : 'open'; },
  },
  async created() {
    if (this.id) {
      await this.fetch({ id: this.id });
    }
  },
  methods: {
    ...call([
      'issue/fetch',
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

  .state
    background-color: #22863A
    background-image: url('../../assets/icons/issue/white_open.svg')
    background-position-y: center
    background-position-x: 4px
    background-repeat: no-repeat
    border-radius: 12px
    box-sizing: border-box
    color: #FFF
    display: inline-block
    font-size: 12px
    height: 24px
    line-height: 20px
    margin-right: 8px
    padding: 2px 8px 2px 24px
    vertical-align: top

    &.closed
      background-color: #D73A49
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
      color: #2196F3
      font-weight: 400


  .comment
    position: relative
    margin-bottom: 20px

    .avatar
      width: 40px
      height: 40px
      border-radius: 20px
      background: #EEE
      position: absolute
      left: 0
      top: 0

    .text
      border-radius: 2px
      border: 1px solid #E8EAF6
      margin-left: 48px
      padding: 10px

      font-family: Roboto
      font-size: 14px
      font-style: normal
      font-weight: 400
      line-height: 18px
      letter-spacing: 0.012em
</style>
