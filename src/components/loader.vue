<template>
  <div class='loader' :class="{ inline: isInline }">
    <h1 v-if='title'>{{ title }}</h1>
    <div class='icon' :class='color' />
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    title: { type: String, default: undefined },
    color: { type: String, default: 'indigo' },
    isInline: { type: Boolean, default: false }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.loader
  margin: 40px 0
  text-align: center

  &.inline
    margin-top: 0

  .icon
    background-repeat: no-repeat
    display: inline-block
    height: 50px
    width: 50px

    &.indigo
      background-image: url('../assets/page_loader.svg')

    &.white
      background-image: url('../assets/page_loader_white.svg')
</style>
