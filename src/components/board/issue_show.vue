<template>
  <div>
    <div class='header'>
      header
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
  }
}
</script>

<style scoped lang='sass'>
.header
  border-bottom: 1px solid #C5CAE9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px

.body
  padding: 12px 14px

.title
  font-size: 20px
  font-weight: 600

  a
    color: #2196F3
    font-weight: 500
    margin-left: 4px
</style>
