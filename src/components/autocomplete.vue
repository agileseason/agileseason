<template>
  <div class='autocomplete'>
    <Input
      v-model='search'
      placeholder='Username'
    />
    <Button
      type='outline'
      size='small'
      text='Create Invite'
      :is-loading='isSubmitting'
      @click='createInvite'
    />
  </div>
</template>

<script>
import Button from '@/components/buttons/button';
import Input from '@/components/inputs/indigo';

export default {
  components: {
    Button,
    Input
  },
  data: () => ({
    search: '',
    isSubmitting: false
  }),
  methods: {
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
