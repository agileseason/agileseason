<template>
  <Modal class='right-side'>
    <div class='header'>
      <div class='title'>
        <span class='icon'/>
        Notes
      </div>
      <div @click='close' class='icon close'/>
    </div>

    <Loader v-if='isLoading' color='white' />
    <div v-else class='notes'>
      <div class='actions'>
        <Button
          class='outline-white'
          size='medium'
          text='New note'
          @click='onNew'
        />
      </div>
      <div v-if='isNew' class='new-note'>
        <MarkdownEditor
          v-model='note'
          placeholder='New note...'
          :assignable-users='[]'
          hide-github-gidelines
          class='body'
        />
        <div class='actions'>
          <Button
            text='Cancel'
            type='outline'
            @click='cancel'
            :is-disabled='isSubmitting'
          />
          <Button
            text='Submit new note'
            @click='submit'
            :is-loading='isSubmitting'
          />
        </div>
      </div>
      <div v-if='isEmpty' class='empty'>There are no notes for this board. Be the first! :)</div>
      <!--div class='note'>
        TODO: Notes
      </div>
      <div>MORE</div-->
    </div>

  </Modal>
</template>

<script>
import Button from '@/components/buttons/button';
import Loader from '@/components/loader';
import MarkdownEditor from '@/components/board/issues/markdown_editor'
import Modal from '@/components/modal';

import { get, call } from 'vuex-pathify';

export default {
  components: {
    Button,
    Loader,
    MarkdownEditor,
    Modal
  },
  props: {},
  data: () => ({
    isNew: false,
    isSubmitting: false,
    note: ''
  }),
  computed: {
    isLoading: get('notes/isLoading'),
    items: get('notes/items'),
    boardId() { return parseInt(this.$route.params.id); },
    isEmpty() {
      return !this.isLoading && this.items.length === 0 && !this.isNew;
    }
  },
  async mounted() {
    await this.fetch({ boardId: this.boardId });
  },
  methods: {
    ...call([
      'notes/fetch',
    ]),
    onNew() {
      this.isNew = true;
    },
    submit() {
      if (this.isSubmitting) { return; }
      this.isSubmitting = true;
    },
    cancel() {
      this.isNew = false;
    },
    close() {
      this.$router.push({ name: 'board', id: this.boardId });
    }
  }
}
</script>

<style scoped lang='sass'>
.header
  color: #fff
  font-size: 16px
  font-weight: 500
  height: 36px
  margin: 0px 8px
  display: flex
  align-items: center
  justify-content: space-between

  .icon
    background-image: url('../assets/icons/menu/note.svg')
    background-position: center
    background-repeat: no-repeat
    display: inline-block
    height: 28px
    width: 28px

  .title
    display: flex
    align-items: center

    .icon
      margin-right: 4px

  .close
    background-image: url('../assets/icons/menu/x-white.svg')
    border-radius: 4px
    cursor: pointer

    &:hover
      background-color: #5c6bc0

    &:active
      background-color: #303f9f

.actions
  display: flex
  justify-content: flex-end
  margin-bottom: 12px

  button + button
    margin-left: 16px

.notes
  box-sizing: border-box
  height: calc(100vh - 36px)
  overflow-y: scroll
  padding: 0 8px

  .empty
    color: #fff
    text-align: center
    margin-top: 40%

  .new-note
    background-color: #fff
    border-radius: 3px
    padding: 6px 8px

    .body
      padding-top: 2px

    .actions
      padding: 4px 0
      margin-bottom: 0

  .note
    background-color: #fff
    height: 2200px
    border-radius: 3px
    padding: 6px 8px

.right-side
  background-color: #283593
  border-radius: 0
  box-shadow: none
  min-height: 100vh
</style>
