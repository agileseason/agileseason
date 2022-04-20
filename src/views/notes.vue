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
      <div class='header-ations'>
        <Button
          class='outline-white'
          size='medium'
          text='New note'
          @click='onNew'
          :is-disabled='isNew'
        />
      </div>

      <div v-if='isNew' class='new-note'>
        <MarkdownEditor
          ref='note'
          v-model='note'
          placeholder='New note...'
          :assignable-users='[]'
          hide-github-gidelines
          class='body'
          @submit='submit'
        >
          <template #actions>
            <div class='actions'>
              <div class='visibility radios'>
                <label class='label'>Visibility:</label>
                <div
                  v-for='(v, $index) in visibility'
                  class='radio'
                  :key='$index'
                >
                  <input
                    v-model='isPrivate'
                    type='radio'
                    :value='v.value'
                    :id='$index'
                  />
                  <label :for='$index' :title='v.title'>
                    {{ v.label }}
                  </label>
                </div>
              </div>
            </div>
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
              class='submit'
            />
          </template>
        </MarkdownEditor>
      </div>

      <div v-if='isEmpty' class='empty'>
        There are no notes for this board. Be the first! :)
      </div>

      <Note
        v-for='item in items'
        :key='item.id'
        v-bind='item'
      />
    </div>

  </Modal>
</template>

<script>
import Button from '@/components/buttons/button';
import Loader from '@/components/loader';
import Markdown from '@/utils/markdown';
import MarkdownEditor from '@/components/board/issues/markdown_editor';
import Modal from '@/components/modal';
import Note from '@/components/board/notes/note';

import { get, call } from 'vuex-pathify';

export default {
  components: {
    Button,
    Loader,
    MarkdownEditor,
    Modal,
    Note
  },
  props: {},
  data: () => ({
    visibility: [
      { value: true, label: 'Private', title: 'Private. Only you can see it' },
      { value: false, label: 'Members', title: 'You and board members can see it' }
    ],
    isNew: false,
    isSubmitting: false,
    note: '',
    isPrivate: true
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
      'notes/createNote'
    ]),
    onNew() {
      this.isNew = true;
      this.$nextTick(() => this.$refs.note.$refs.textarea.focus());
    },
    async submit() {
      if (this.isSubmitting) { return; }
      this.isSubmitting = true;

      await this.createNote({
        boardId: this.boardId,
        body: this.note,
        isPrivate: this.isPrivate
      });

      this.isNew = false;
      this.isSubmitting = false;
      this.note = '';
    },
    cancel() {
      this.isNew = false;
    },
    close() {
      this.$router.push({ name: 'board', id: this.boardId });
    },
    markdown(text) {
      return Markdown.render(text);
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
  margin: 0px 8px 0 6px
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

.header-ations
  display: flex
  justify-content: flex-end
  margin-bottom: 12px

.actions
  display: flex
  justify-content: space-between
  width: 100%

  .button
    margin: 4px 0 2px

  .button + .button
    margin-left: 16px

  .radios
    margin-left: 2px
    display: flex
    align-items: center

    label.label
      color: #283593
      font-weight: 500
      margin-right: 8px

    .radio
      align-items: center
      cursor: pointer
      display: flex


      input
        cursor: pointer
        margin: 0 4px 0 0

      label
        cursor: pointer
        margin-right: 10px

.notes
  box-sizing: border-box
  height: calc(100vh - 36px)
  overflow-y: scroll
  padding: 0 12px

  .empty
    color: #fff
    text-align: center
    margin-top: 40%

  .new-note
    background-color: #fff
    border-radius: 3px
    padding: 6px 8px
    margin-bottom: 12px

    .body
      padding-top: 2px

    .actions
      padding: 4px 0 2px
      margin-bottom: 0

      .submit
        min-width: 160px

.right-side
  background-color: #283593
  border-radius: 0
  box-shadow: none
  min-height: 100vh
</style>
