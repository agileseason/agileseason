<template>
  <!--div class='issue' @click='open'-->

  <div class='issue' @click='goToIssue'>
    <div class='title'>{{ title }}</div>
    <a :href='url' class='url' @click.stop='click'>
      <span class='number'>#{{ number }}</span>
      {{ repositoryName }}
    </a>
    <div v-if='isLabels' class='labels'>
      <span
        class='label'
        v-for='label in labels'
        :key='label'
        :style='labelStyle(label)'
      >
        {{ label.name }}
      </span>
    </div>
    <div v-if='isActionVisible' class='actions'>
      <span v-if='isClosed' class='closed'>Closed</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Issue',
  components: {
  },
  props: {
    id: { type: Number, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    repositoryName: { type: String, required: true },
    labels: { type: Array, required: true },
    isClosed: { type: Boolean, required: true }
  },
  data: () => ({}),
  computed: {
    isLabels() { return this.labels.length > 0; },
    isActionVisible() { return this.isClosed; }
  },
  methods: {
    labelStyle({ color }) { return `background-color: #${color}`; },
    open() {
      // console.log('issue-open' + this.id);
      this.$emit('open', this);
    },
    goToIssue() {
      console.log('issue-open');
      this.$router.push({ name: 'issue', params: { id: this.id } });
    }
  }
}
</script>

<style scoped lang='sass'>
.issue
  background-color: #FFF
  border-radius: 4px
  margin-bottom: 8px
  padding: 8px
  cursor: pointer

  .title
    color: #212121
    font-size: 15px
    font-weight: 500
    line-height: 18px
    word-break: break-word

  a.url
    color: #757575
    display: inline-block
    margin-top: 4px

    &:hover
      color: #616161
      // text-decoration: underline

    .number
      color: #616161
      font-weight: 600

  .labels
    .label
      border-radius: 10px
      color: #212121
      display: inline-block
      font-size: 11px
      font-weight: 600
      height: 19px
      letter-spacing: 0.2px
      line-height: 19px
      margin-top: 6px
      margin-right: 6px
      padding: 0 9px

  .actions
    margin-top: 8px

    .closed
      background-color: #FFCDD2
      border-radius: 4px
      color: #D73A49
      display: inline-block
      font-size: 11px
      font-weight: 400
      height: 22px
      letter-spacing: 0.2px
      line-height: 23px
      padding: 0 7px 0 25px
      position: relative

      &:before
        background-image: url('../../assets/icons/closed.svg')
        background-position: center
        background-repeat: no-repeat
        content: ''
        display: inline-block
        height: 16px
        left: 5px
        position: absolute
        top: 3px
        width: 16px
</style>
