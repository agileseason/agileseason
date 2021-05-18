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

  input
    margin-right: 12px

  button
    width: 134px
</style>
