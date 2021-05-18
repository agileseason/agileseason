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
  data: () => ({
    search: '',
    submittingSearch: '',
    selectedUser: null,
    isSearching: false,
    isSubmitting: false
  }),
  computed: {
    isDisabled() {
      return this.selectedUser == null || this.isSearching || this.isSubmitting;
    }
  },
  methods: {
    updateInternalValue (event) {
      this.updateValue(event.target.value)
    },
    updateValue: _debounce(function (value) {
      if (this.submittingSearch != value) {
        this.submittingSearch = value;
        this.isSearching = true;
        // TODO: Fetch users
        console.log(this.submittingSearch);
        console.log('search...');
      }
    }, 600),
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
