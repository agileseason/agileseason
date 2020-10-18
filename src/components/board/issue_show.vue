<template>
  <div>
    <div class='header'>
      <span class='repo'>{{ repositoryName }}</span>
      <div class='close' @click='close' />
    </div>
    <div class='body'>
      <div class='title'>
        {{ title }}<a :href='url'>#{{ number }}</a>
      </div>
      <div class='main-comment'>body</div>
      <div class='comments'>comments...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IssueShow',
  components: {
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
    // isLabels() { return this.labels.length > 0; },
    // isActionVisible() { return this.isClosed; }
    id() { return this.issue?.id; },
    title() { return this.issue?.title; },
    number() { return this.issue?.number; },
    url() { return this.issue?.url; },
    repositoryName() { return this.issue?.repositoryName; },
  },
  methods: {
    close() { this.$emit('close'); }
  }
}
</script>

<style scoped lang='sass'>
.header
  border-bottom: 1px solid #C5CAE9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px
  position: relative

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

.body
  padding: 12px 14px

.title
  font-size: 20px
  font-weight: 500

  a
    color: #2196F3
    font-weight: 400
    margin-left: 4px
</style>
