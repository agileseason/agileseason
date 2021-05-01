<template>
  <div class='loader' :class="{ inline: isInline }">
    <h1 v-if='title'>{{ title }}</h1>
    <div class='icon' />
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    title: { type: String, required: false, default: undefined },
    isInline: { type: Boolean, required: false, default: false }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.loader
  margin-top: 80px
  text-align: center

  &.inline
    margin-top: 0

  .icon
    background-image: url('../assets/page_loader.svg')
    background-repeat: no-repeat
    display: inline-block
    height: 50px
    width: 50px
</style>
