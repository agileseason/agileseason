<template>
  <div class='editor'>
    <textarea
      v-bind='$attrs'
      :value='modelValue'
      :placeholder='placeholder'
      ref='textarea'
      @input='onInput'
      @keydown='onKeyDown'
      @blur='closePopup'
    />
    <div v-if='isModalOpen' class='mention-modal' :style='modalPositionStyles'>
      <div
        v-for='(user, $index) in filteredItems'
        :key='$index'
        class='user'
        :class='{ "selected": $index === selectedIndex }'
        @mouseover='selectedIndex = $index'
        @mousedown='applyMention($index)'
      >
        {{ user.login }}
      </div>
    </div>
    <GithubCommunityGidelines />
    <div class='actions'>
      <slot name='actions' />
    </div>
  </div>
</template>

<script>
import GithubCommunityGidelines from '@/components/board/issues/github_community_guidelines'
import getCaretPosition from 'textarea-caret'

export default {
  components: {
    GithubCommunityGidelines
  },
  props: {
    placeholder: { type: String, default: 'Leave a comment...' },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    assignableUsers: { type: Array, required: true }
  },
  data: () => ({
    keys: ['@'],
    limit: 20,
    key: undefined,
    keyIndex: undefined,
    caretPosition: undefined,
    searchText: '',
    lastSearchText: '',
    selectedIndex: 0,
    isModalOpen: false
  }),
  computed: {
    filteredItems() {
      if (!this.searchText) { return this.assignableUsers; }

      const searchText = this.searchText.toLowerCase();
      return this.assignableUsers.filter(item => {
        let text
        if (item.searchText) {
          text = item.searchText;
        } else if (item.login) {
          text = item.login;
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
      if (this.caretPosition == null) { return 'top: 20px; left: 68px;' }
      const { top, left } = this.caretPosition;
      return `top: ${top + 20}px; left: ${left + 68}px;`;
    }
  },
  watch: {
    displayedItems () { this.selectedIndex = 0; }
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', e.target.value);
      this.checkKey(e.target.value);
    },
    onKeyDown(e) {
      if (this.key == null) { return; }

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
        if (!(keyIndex < 1 || /\s/.test(value[keyIndex - 1]))) {
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
    updateCaretPosition () {
      if (this.key) {
        this.caretPosition = getCaretPosition(this.$refs.textarea, this.keyIndex);
        this.caretPosition.top -= this.$refs.textarea.scrollTop;
      }
    },

    applyMention(itemIndex) {
      const item = this.displayedItems[itemIndex];
      const value = this.key + item.login + ' ';
      this.$emit(
        'update:modelValue',
        this.replaceText(this.$refs.textarea.value, this.searchText, value, this.keyIndex)
      );
      this.setCaretPosition(this.keyIndex + value.length);
      this.closePopup();
    },

    replaceText (text, searchText, newText, index) {
      return `${text.slice(0, index)}${newText}${text.slice(index + searchText.length + 1, text.length)}`;
    },

    setCaretPosition (index) {
      this.$nextTick(() => this.$refs.textarea.selectionEnd = index)
    }
  }
}
</script>

<style scoped lang='sass'>
.editor
  position: relative

.mention-modal
  background-color: #e8eaf6
  border-radius: 4px
  border: 1px solid #c5cae9
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1)
  box-sizing: border-box
  position: absolute
  padding: 0

  .user
    cursor: pointer
    padding: 8px 10px

    &:not(:last-child)
      border-bottom: 1px solid #c5cae9

    &.selected
      background-color: #c5cae9

textarea
  border-radius: 3px
  border: 1px solid #c5cae9
  box-sizing: border-box
  font-size: 16px
  font-weight: 300
  margin-left: 50px
  padding: 8px
  width: calc(100% - 50px) // 100% - margin-left
  min-height: 200px
  resize: none

  &::placeholder
    color: #9fa8da
    opacity: 1
  &:-ms-input-placeholder
    color: #9fa8da
  &::-ms-input-placeholder
    color: #9fa8da

.actions
  display: flex
  justify-content: flex-end
</style>
