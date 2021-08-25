<template>
  <div
    class='note'
    v-html='markdown(body)'
  />
</template>

<script>
import Markdown from '@/utils/markdown';

export default {
  props: {
    id: { type: [String, Number], required: true },
    body: { type: String, required: true }
  },
  methods: {
    markdown(text) {
      return Markdown.render(text);
    }
  }
}
</script>

<style scoped lang='sass'>
.note
  background-color: #fff
  border-radius: 3px
  padding: 6px 12px
  margin-bottom: 12px
  position: relative
</style>
