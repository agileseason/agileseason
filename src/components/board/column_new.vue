<template>
  <div class='column-new'>
    <button v-if='!isOpen' class='new' @click='open'>New Column...</button>
    <Dialog v-if='isOpen' @close='close' style='margin-top: 32px'>
      <input
        v-model.trim='name'
        class='name'
        type='text'
        @keyup.enter='submit'
        @keyup.esc='close'
        placeholder='Column name'
        ref='name'
      />
      <template #actions>
        <Button @click='close' type='flat' text='Close' />
        <Button
          :is-disabled='isDisabled'
          @click='submit'
          type='white'
          text='Submit'
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Button from '@/components/buttons/button';
import Dialog from '@/components/dialog';

export default {
  name: 'ColumnNew',
  components: {
    Button,
    Dialog
  },
  data: () => ({
    name: '',
    isOpen: false
  }),
  computed: {
    isDisabled() {
      return this.name.length === 0;
    }
  },
  methods: {
    open() {
      this.name = '';
      this.isOpen = true;
      this.$nextTick(() => this.$refs.name?.focus());
    },
    close() {
      this.isOpen = false;
    },
    submit() {
      if (this.name === '') { return; }

      this.$emit('submit', this.name);
      this.name = '';
      this.close();
    }
  }
}
</script>

<style scoped lang='sass'>
.column-new
  display: inline-block
  position: relative
  vertical-align: top
  width: 280px

  input.name
    background-color: #7986cb
    border-radius: 3px
    border: 1px solid #7986cb
    box-sizing: border-box
    color: #fff
    font-size: 16px
    font-weight: 400
    height: 28px
    letter-spacing: 0.4px
    margin-bottom: 8px
    padding: 0 6px
    width: 100%
    outline: none

    &:focus
      border-color: #fff

    &::placeholder
      color: #9fa8da
      opacity: 1
    &:-ms-input-placeholder
      color: #9fa8da
    &::-ms-input-placeholder
      color: #9fa8da

  button.new
    background-color: transparent
    border-radius: 4px
    border: 1px solid #c5cae9
    color: #7986cb
    cursor: pointer
    font-size: 14px
    font-weight: 300
    height: 32px
    margin-top: 32px
    width: 100%

    &:hover
      color: #303f9f
      border: 1px solid #9fa8da

    &:active
      color: #5c6bc0
      border: 1px solid #7986cb

button + button
  margin-left: 2px
</style>
