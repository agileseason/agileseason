<template>
  <div class='issue'>
    <div class='title'>
      {{ title }}
    </div>
    <a :href='url' class='url'>
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
    labels: { type: Array, required: true }
  },
  data: () => ({}),
  computed: {
    isLabels() { return this.labels.length > 0; }
  },
  methods: {
    labelStyle({ color }) {
      return `background-color: #${color}`;
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
    margin-top: 6px

    .label
      // color: #FFFFFF
      color: #212121
      display: inline-block
      font-size: 11px
      font-weight: 600
      height: 19px
      line-height: 19px
      padding: 0 8px
      border-radius: 10px
      margin-right: 6px
</style>
