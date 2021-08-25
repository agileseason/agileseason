<template>
  <div class='note-wrapper'>
    <div
      class='note'
      v-html='markdown(body)'
    />
    <ButtonIcon name='dots' @click='openSettings' />
    <Select v-if='isSettingsOpen' class='select-settings'>
      <div class='item' @click='editNote'>Edit</div>
      <div class='item danger' @click='deleteNote'>Delete</div>
    </Select>
    <div v-if='isSettingsOpen' class='select-overlay' @click.self='closeSettings' />
  </div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon';
import Markdown from '@/utils/markdown';
import Select from '@/components/select';
import { call } from 'vuex-pathify';

export default {
  props: {
    id: { type: [String, Number], required: true },
    body: { type: String, required: true }
  },
  components: {
    ButtonIcon,
    Select
  },
  data: () => ({
    isSettingsOpen: false,
    isDeleting: false
  }),
  methods: {
    ...call([
      // 'issue/updateComment',
      'notes/destroyNote'
    ]),
    openSettings() { this.isSettingsOpen = true; },
    closeSettings() { this.isSettingsOpen = false; },
    editNote() {
      console.log('todo: edit');
    },
    async deleteNote() {
      if (this.isDeleting) { return; }

      if (confirm('Are you sure you want to delete this?')) {
        this.isSettingsOpen = false;
        this.isDeleting = true;
        await this.destroyNote({ id: this.id });
      }
    },
    markdown(text) { return Markdown.render(text); }
  }
}
</script>

<style scoped lang='sass'>
.note-wrapper
  position: relative

.note
  background-color: #fff
  border-radius: 3px
  padding: 6px 12px
  margin-bottom: 12px

.icon
  position: absolute
  right: 8px
  top: 10px

// TODO: Remove duplicate comment.vue / note.vue
.select-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

.select-settings
  overflow: hidden
  position: absolute
  right: 8px
  top: 32px
  z-index: 2

  .item
    cursor: pointer
    padding: 8px 10px

    &.danger
      color: #d73a49

      &:hover
        background-color: #d73a49
        color: #fff

    &:hover
      background-color: #c5cae9

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9
</style>
