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
        draggable='true'
        @dragstart='dragStart($event, issue)'
        @open='openIssue'
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
  data: () => ({}),
  computed: {
    issuesCount() { return this.issues.length; }
  },
  methods: {
    issueNew() { this.$emit('new', { columnId: this.id }); },
    columnSettings() {
      console.log('column-settings');
    },
    dragStart(e, issue) {
      console.log('[dragStart] Issue: ' + issue?.id);
      // console.log(e.target.className);
      if (e.target.className === 'issue') {
        // issue.isDragStart = true;
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('itemKind', 'issue');
        e.dataTransfer.setData('itemID', issue.id);
      }
    },
    openIssue({ id, number, title, url, repositoryName, isClosed }) {
      console.log('open-issue-column' + id);
      this.$emit('open', { id, number, title, url, repositoryName, isClosed });
    }
  }
}
</script>

<style scoped lang='sass'>
.column
  display: inline-block
  margin-right: 8px
  vertical-align: top
  width: 270px

  &.is-drag-enter
    background-color: rgba(197,202,233,0.4)
    border-radius: 6px

  &.is-drag-start
    background-color: #E8EAF6
    border-radius: 6px

  .header
    // cursor: grab
    // cursor: grabbing
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
    height: calc(100vh - 80px)
    overflow-y: scroll
</style>
