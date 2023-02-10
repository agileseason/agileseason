<template>
  <div class='editor'>
    <div class='textarea-container' :class='computedContainerClasses'>
      <textarea
        v-bind='$attrs'
        :style='computedStyles'
        :value='modelValue'
        :disabled='isUploading'
        :placeholder='placeholder'
        :class='markdownEditorFont'
        ref='textarea'
        @input='onInput'
        @keydown='onKeyDown'
        @blur='removeContainerFocus'
        @focus='addContainerFocus'
        @paste='onPaste'
      />
      <Loader v-if='isUploading' class='loader' />
      <div class='attach-image'>
        <input
          accept='.gif,.jpeg,.jpg,.png'
          type='file'
          :id='uploadId'
          :name='uploadId'
          @change='onFileChange'
        />
        <span class='note'>Attach images by selecting or pasting them</span>
      </div>
    </div>
    <Select v-if='isModalOpen' class='mention-modal' :style='modalPositionStyles'>
      <div
        v-for='(item, $index) in displayedItems'
        :key='$index'
        class='item'
        :class='{ "selected": $index === selectedIndex }'
        @mouseover='selectedIndex = $index'
        @mousedown='applyMention($index)'
      >
        {{ item.login || item.label }}
      </div>
    </Select>
    <GithubCommunityGidelines v-if='!hideGithubGidelines' />
    <div class='actions'>
      <slot name='actions' />
    </div>
  </div>
</template>

<script>
import GithubCommunityGidelines from '@/components/board/issues/github_community_guidelines'
import Loader from '@/components/loader';
import Select from '@/components/select';
import { get } from 'vuex-pathify';
import getCaretPosition from 'textarea-caret'

import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';

const MIN_HEIGHT = 200;
const MAX_HEIGHT = 600;

export default {
  components: {
    GithubCommunityGidelines,
    Loader,
    Select
  },
  props: {
    placeholder: { type: String, default: 'Leave a comment...' },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    assignableUsers: { type: Array, required: true },
    mentionPositionTop: { type: Number, default: 20 },
    mentionPositionLeft: { type: Number, default: 20 },
    hideGithubGidelines: { type: Boolean, default: false }
  },
  emits: ['submit', 'update:modelValue'],
  data: () => ({
    keys: ['@', '#'],
    limit: 1000,
    key: undefined,
    keyIndex: undefined,
    caretPosition: undefined,
    searchText: '',
    lastSearchText: '',
    selectedIndex: 0,
    isModalOpen: false,
    isUploading: false,
    isTextareaFocused: false,
    height: `${MIN_HEIGHT}px`,
    uppy: undefined
  }),
  computed: {
    ...get([
      'board/mentionIssues',
      'user/markdownEditorFont'
    ]),
    computedStyles() {
      return ({
        height: `${this.height}`
      });
    },
    computedContainerClasses() {
      return this.isTextareaFocused ? 'focused' : null;
    },
    filteredItems() {
      const items = this.key === '@' ? this.assignableUsers : this.mentionIssues;
      if (!this.searchText) { return items; }

      const searchText = this.searchText.toLowerCase();
      return items.filter(item => {
        let text
        if (item.searchText) {
          text = item.searchText;
        } else if (item.login || item.label) {
          text = item.login || item.label;
        } else {
          text = ''
          for (const key in item) {
            text += item[key];
          }
        }
        return text.toLowerCase().includes(searchText);
      });
    },
    displayedItems() { return this.filteredItems.slice(0, this.limit); },
    modalPositionStyles() {
      if (this.caretPosition == null) {
        return `top: ${this.mentionPositionTop}px; left: ${this.mentionPositionLeft}px;`;
      }

      const { top, left } = this.caretPosition;
      return `top: ${top + this.mentionPositionTop}px; left: ${left + this.mentionPositionLeft}px;`;
    },
    uploadId() { return `upload_id_${Math.random().toString(36).substr(2)}`; }
  },
  mounted() {
    this.resizeTextarea();
    this.$nextTick(() => {
      this.setCaretPosition(0);
      this.$refs.textarea.scrollTop = 0;
      this.$refs.textarea.scrollLeft = 0;
    });
    const DOMAIN_API = {
      development: 'http://localhost:3000',
      production: 'https://api.agileseason.com'
    }[process.env.NODE_ENV];

    this.uppy = Uppy({
      id: this.uploadId,
      autoProceed: true,
      debug: false,
      restrictions: {
        maxFileSize: 1024 * 1024 * 10,
        allowedFileTypes: ['image/*']
      },
      onBeforeUpload: (files) => {
        const updatedFiles = Object.assign({}, files);
        Object
          .keys(updatedFiles)
          .forEach(fileId => {
            updatedFiles[fileId].name = `${this.uuid()}.${updatedFiles[fileId].extension}`;
            // console.log('uploading...');
          });
        return updatedFiles;
      }
    })
      .use(AwsS3, {
        getUploadParameters: (file) => (
          fetch(`${DOMAIN_API}/s3/params?filename=${file.name}&extension=.${file.extension}&type=${file.type}`)
            .then(response => response.json())
        )
      })
      .on('upload-success', (result) => {
        // console.log('upload-success');
        // console.log(result);
        // console.log(result.meta.key);
        // console.log('URL:');
        // console.log(`https://agileseason3.s3.eu-central-1.amazonaws.com/${result.meta.key}`);
        const fileName = result.meta.key;
        const url = `https://agileseason3.s3.eu-central-1.amazonaws.com/${fileName}`;
        const value = `![img](${url})\n`;
        const index = this.$refs.textarea.selectionStart;
        this.$emit(
          'update:modelValue',
          this.replaceText(this.$refs.textarea.value, '', value, index)
        );
        this.setCaretPosition(index + value.length - 1);
        this.isUploading = false;
        this.$nextTick(() => this.$refs.textarea.focus());
      })
      .on('upload-error', (file, error) => {
        alert(error.message);
        this.isUploading = false;
      });
  },
  watch: {
    displayedItems() { this.selectedIndex = 0; },
    modelValue() {
      this.$nextTick(this.resizeTextarea);
    }
  },
  methods: {
    uuid() { return `${Math.random().toString(36).substr(2)}-${Math.random().toString(36).substr(2)}`; },
    onFileChange({ currentTarget }) {
      if (currentTarget.files.length === 0) { return; }

      Array
        .from(currentTarget.files)
        .forEach(file => this.addFile(file));
    },
    onPaste(e) {
      let files = [];
      for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
        var item = e.clipboardData.items[i];
        if (item.type.indexOf('image') != -1) {
          files.push(item.getAsFile());
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        this.addFile(files[0]);
        // NOTE: Uploading many files is unstable.
        // files.forEach(file => this._addFile(file));
      }
    },
    addFile(file) {
      try {
        this.isUploading = true;
        this.uppy.addFile({ name: file.name, type: file.type, data: file });
      } catch(err) {
        alert(err.message);
        this.isUploading = false;
      }
    },
    resizeTextarea() {
      this.$nextTick(() => {
        let contentHeight = this.$refs.textarea.scrollHeight;
        if (contentHeight < MIN_HEIGHT) {
          contentHeight = MIN_HEIGHT;
        }
        if (contentHeight > MAX_HEIGHT) {
          contentHeight = MAX_HEIGHT;
        }
        this.height = `${contentHeight}px`;
      });
    },
    onInput(e) {
      this.$emit('update:modelValue', e.target.value);
      this.checkKey(e.target.value);
    },
    onKeyDown(e) {
      if (this.key == null) {
        if (e.key === 'Enter') {
          if (e.metaKey) this.$emit('submit');
          else {
            const rows = this.modelValue.split("\n");
            if (rows.length === 0) return;

            const lastRow = rows.at(-1);
            if (lastRow == null) return;

            // Добавляем символы (1., -, - [ ]) только если курсор на последней строке.
            // Пока лучшего не придумал.
            const index = this.$refs.textarea.selectionStart;
            if (this.modelValue[index] !== undefined) { return; }

            if (/^\d+\. /.test(lastRow)) {
              e.preventDefault();
              e.stopPropagation();
              this.$emit('update:modelValue', this.modelValue + "\n1. ");

            } else if (/^- \[\s|x\] /.test(lastRow)) {
              e.preventDefault();
              e.stopPropagation();
              this.$emit('update:modelValue', this.modelValue + "\n- [ ] ");

            } else if (/^- /.test(lastRow)) {
              e.preventDefault();
              e.stopPropagation();
              this.$emit('update:modelValue', this.modelValue + "\n- ");
            }
          }
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        this.selectedIndex++;
        if (this.selectedIndex >= this.displayedItems.length) {
          this.selectedIndex = 0;
        }
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'ArrowUp' || e.keyCode === 38) {
        this.selectedIndex--;
        if (this.selectedIndex < 0) {
          this.selectedIndex = this.displayedItems.length - 1;
        }
        e.preventDefault();
        e.stopPropagation();
      }
      if ((e.key === 'Enter' || e.key === 'Tab' || e.keyCode === 13 || e.keyCode === 9) &&
        this.displayedItems.length > 0) {
        this.applyMention(this.selectedIndex)
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === 'Escape' || e.keyCode === 27) {
        this.closePopup();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    checkKey(value) {
      const index = this.$refs.textarea.selectionStart;
      if (index >= 0) {
        const { key, keyIndex } = this.getLastKeyBeforeCaret(index, value);
        const searchText = this.lastSearchText = this.getLastSearchText(index, keyIndex, value);
        const prevChar = value[keyIndex - 1];
        if (this.keys.some(v => v === prevChar)) {
          this.closePopup();
          return false;
        }
        if (!(keyIndex < 1 || /\s/.test(prevChar))) {
          return false;
        }
        if (searchText != null) {
          this.openPopup(key, keyIndex);
          this.searchText = searchText;
          return true;
        }
      }
      this.closePopup();
      return false;
    },
    getLastKeyBeforeCaret(caretIndex, value) {
      const [keyData] = this.keys.map(key => ({
        key,
        keyIndex: value.lastIndexOf(key, caretIndex - 1),
      })).sort((a, b) => b.keyIndex - a.keyIndex)
      return keyData;
    },
    getLastSearchText (caretIndex, keyIndex, value) {
      if (keyIndex === -1) { return; }

      const searchText = value.substring(keyIndex + 1, caretIndex);
      if (/\s/.test(searchText)) { return; }

      return searchText;
    },
    openPopup(key, keyIndex) {
      if (this.key === key) { return; }

      this.key = key;
      this.keyIndex = keyIndex;
      this.updateCaretPosition();
      this.selectedIndex = 0;
      this.isModalOpen = true;
    },
    closePopup () {
      if (this.key == null) { return; }

      this.key = null;
      this.isModalOpen = false;
    },
    removeContainerFocus() {
      this.isTextareaFocused = false;
      this.closePopup();
    },
    addContainerFocus() {
      this.isTextareaFocused = true;
    },
    updateCaretPosition () {
      if (this.key) {
        this.caretPosition = getCaretPosition(this.$refs.textarea, this.keyIndex);
        this.caretPosition.top -= this.$refs.textarea.scrollTop;
      }
    },

    applyMention(itemIndex) {
      const item = this.displayedItems[itemIndex];
      const value = this.key + (item.login || item.value) + ' ';
      this.$emit(
        'update:modelValue',
        this.replaceText(this.$refs.textarea.value, this.searchText, value, this.keyIndex)
      );
      this.setCaretPosition(this.keyIndex + value.length);
      this.closePopup();
    },

    replaceText(text, searchText, newText, index) {
      return `${text.slice(0, index)}${newText}${text.slice(index + searchText.length + 1, text.length)}`;
    },

    setCaretPosition(index) {
      this.$nextTick(() => this.$refs.textarea.selectionEnd = index)
    }
  }
}
</script>

<style scoped lang='sass'>
.editor
  position: relative

.mention-modal
  position: absolute
  max-width: 600px
  z-index: 1

  .item
    cursor: pointer
    padding: 8px 10px

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9

    &.selected
      background-color: #c5cae9

textarea
  border-radius: 3px
  // border: 1px solid #c5cae9
  border: none
  box-sizing: border-box
  font-size: 14px
  font-weight: 300
  line-height: 20px
  padding: 8px
  resize: none
  width: 100%

  &.mono
    //font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace
    font-family: 'Roboto Mono',
    font-weight: 300
    line-height: 1.5

  &::placeholder
    color: #9fa8da
    opacity: 1
  &:-ms-input-placeholder
    color: #9fa8da
  &::-ms-input-placeholder
    color: #9fa8da

  &:focus
    outline: none

  &:focus + .attach-image
    border-top: 1px dashed #005FCC

.textarea-container
  position: relative
  border-radius: 4px
  border: 1px solid #c5cae9

  &.focused
    border: 1px #005FCC solid
    box-shadow: 0 0 0 1px #005FCC

  .loader
    position: absolute
    top: -14px
    left: calc(50% - 20px)

  .attach-image
    margin-top: -3px
    height: 24px
    background-color: #fff
    border-top: 1px dashed #c5cae9
    border-radius: 0 0 4px 4px

    input
      position: absolute
      bottom: 0
      height: 24px
      opacity: 0
      width: 100%
      z-index: 1

    .note
      position: absolute
      bottom: 4px
      left: 10px
      color: #9fa8da
      font-size: 12px
      z-index: 0

.actions
  display: flex
  justify-content: flex-end
</style>
