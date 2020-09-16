<template>
  <div class='column'>
    <div class='header'>
      <span class='issues'>{{ visibleIssuesCount }}</span>
      <span class='name'>{{ name }}</span>
    </div>
    <div class='body'>
      TODO: Issue List
    </div>
  </div>
</template>

<script>
export default {
  name: 'Column',
  components: {
  },
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: false, default: 'Unknown' },
    issuesCount: { type: Number, required: false, default: 0 }
  },
  data: () => ({
    loadedIssuesCount: undefined
  }),
  computed: {
    visibleIssuesCount() {
      return this.loadedIssuesCount || this.issuesCount;
    }
  },
  methods: {}
}
</script>

<style scoped lang='sass'>
.column
  display: inline-block
  height: 200px
  margin-right: 8px
  vertical-align: top
  width: 270px

  &.is-drag-enter
    background-color: rgba(0,0,0,0.1)

  .header
    cursor: pointer
    margin-bottom: 8px

    .issues
      background-color: #C5CAE9
      border-radius: 4px
      box-sizing: border-box
      color: #5C6BC0
      display: inline-block
      font-size: 13px
      height: 22px
      line-height: 22px
      margin-right: 8px
      min-width: 22px
      padding: 0 2px
      text-align: center

    .name
      color: #283593
      display: inline-block
      font-weight: 500
      line-height: 22px
      vertical-align: bottom

  .body
    // background-color: #999
    min-height: 300px
</style>
