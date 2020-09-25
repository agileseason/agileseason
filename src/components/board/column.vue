<template>
  <div class='column'>
    <div class='header'>
      <span class='issues-count'>{{ issuesCount }}</span>
      <span class='name'>{{ name }}</span>
      <div class='actions'>
        <div class='issue-new' @click='issueNew' />
        <div class='column-settings' @click='columnSettings' />
      </div>
    </div>
    <div class='body'>
      <Issue
        v-for='issue in issues'
        :key='issue.id'
        v-bind='issue'
      />
    </div>
  </div>
</template>

<script>
import Issue from '@/components/board/issue.vue';

export default {
  name: 'Column',
  components: {
    Issue
  },
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: false, default: 'Unknown' },
    issues: { type: Array, required: true }
  },
  data: () => ({
    // issues: [
    //   { id: 1, title: 'Create a draft of the new design. In the figma' },
    //   { id: 2, title: 'Create a draft of the new design. In the figma' },
    //   { id: 3, title: 'Create a draft of the new design. In the figma' }
    // ],
    // loadedIssuesCount: undefined
  }),
  computed: {
    issuesCount() { return this.issues.length; }
  },
  methods: {
    issueNew() {
      console.log('issue-new');
    },
    columnSettings() {
      console.log('column-settings');
    }
  }
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

    .issues-count
      background-color: #C5CAE9
      border-radius: 4px
      box-sizing: border-box
      color: #5C6BC0
      display: inline-block
      font-size: 13px
      height: 24px
      line-height: 24px
      margin-right: 8px
      min-width: 24px
      padding: 0 8px
      text-align: center

    .name
      color: #283593
      display: inline-block
      font-weight: 500
      line-height: 24px
      vertical-align: bottom

    .actions
      float: right

      .issue-new,
      .column-settings
        border-radius: 4px
        cursor: pointer
        display: inline-block
        height: 24px
        margin-left: 6px
        width: 24px
        background-position: center
        background-repeat: no-repeat

        &:hover
          background-color: #C5CAE9
        &:active
          background-color: #9FA8DA

      .issue-new
        background-image: url('../../assets/icons/plus.svg')

        &:hover
          background-image: url('../../assets/icons/plus-hover.svg')
        &:active
          background-image: url('../../assets/icons/plus-hover.svg')

      .column-settings
        background-image: url('../../assets/icons/dots.svg')

        &:hover
          background-image: url('../../assets/icons/dots-hover.svg')
        &:active
          background-image: url('../../assets/icons/dots-hover.svg')

  .body
    min-height: 300px
</style>
