<template>
  <div class='autocomplete'>
    <Input
      v-model='search'
      placeholder='Username'
      @input='updateInternalValue'
    />
    <Button
      type='outline'
      size='small'
      text='Create Invite'
      :is-disabled='isDisabled'
      :is-loading='isSubmitting'
      @click='createInvite'
    />
    <div v-if='isEmpty' class='suggestions'>
      <div class='suggestion-none'>Nothing found</div>
    </div>
    <div v-if='!isEmpty && isOpen' class='suggestions'>
      <div
        v-for='(item, $index) in suggestions'
        class='suggestion'
        :key='$index'
        @click='select(item)'
      >
        <img class='avatar' :src='item.avatarUrl' />
        <span class='login'>{{ item.login }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button';
import Input from '@/components/inputs/indigo';
import _debounce from 'lodash/debounce';

export default {
  components: {
    Button,
    Input
  },
  props: {
    fetchSuggestions: { type: Function, required: true }
  },
  data: () => ({
    search: '',
    submittingSearch: '',
    selected: null,
    suggestions: [],
    isLoaded: false,
    isSearching: false,
    isSubmitting: false
  }),
  computed: {
    isOpen() {
      if (this.selected == null) { return true; }
      return this.search !== this.selected.login;
    },
    isDisabled() {
      return this.selected == null || this.isSearching || this.isSubmitting;
    },
    isEmpty() {
      return this.isLoaded && this.suggestions.length === 0;
    }
  },
  methods: {
    updateInternalValue(event) {
      this.updateValue(event.target.value);
    },
    updateValue: _debounce(function (value) {
      if (this.submittingSearch != value) {
        this.submittingSearch = value;
        this.isSearching = true;
        this.isLoaded = false;
        this.fetchSuggestions(this.submittingSearch)
          .then(items => {
            this.suggestions = items;
            this.isSearching = false;
            this.isLoaded = true;
          });
      }
    }, 1000),
    select(item) {
      this.selected = item;
      this.search = item.login;
    },
    createInvite() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      console.log(this.search);
    }
  }
}
</script>

<style scoped lang='sass'>
.autocomplete
  display: flex
  position: relative

  input
    margin-right: 12px
    min-width: 220px

  button
    width: 134px

  .suggestions
    background-color: #e8eaf6
    border-radius: 4px
    border: 1px solid #c5cae9
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1)
    left: 0
    position: absolute
    top: 32px

    .suggestion-none
      box-sizing: border-box
      color: #7986cb
      font-weight: 300
      min-width: 220px
      padding: 6px

    .suggestion
      align-items: center
      box-sizing: border-box
      cursor: pointer
      display: flex
      min-width: 220px
      padding: 6px

      &:not(:last-child)
        border-bottom: 1px solid #c5cae9

      &:hover
        background-color: #c5cae9

      .avatar
        border-radius: 11px
        height: 22px
        margin-right: 4px
        width: 22px
</style>
