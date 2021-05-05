<template>
  <div class='column-new'>
    <button v-if='!isOpen' class='new' @click='open'>New Column...</button>
    <div v-if='isOpen' class='dialog'>
      <input
        v-model='name'
        class='name'
        type='text'
        placeholder='Column name'
        ref='name'
      />
      <div class='footer'>
        <Button @click='close' type='flat' text='Close' />
        <Button
          :is-disabled='isDisabled'
          @click='submit'
          type='white'
          text='Submit'
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'

export default {
  name: 'ColumnNew',
  components: {
    Button
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
  width: 270px

  .dialog
    background-color: #3F51B5
    border-radius: 4px
    border: 1px solid #3F51B5
    color: #FFF
    padding: 8px
    position: absolute
    text-align: left
    width: 100%

    .footer
      border-top: 1px solid #7986CB
      text-align: right
      padding-top: 8px

      .button
        margin-left: 8px

  input.name
    background-color: #7986CB
    border-radius: 3px
    border: 1px solid #7986CB
    box-sizing: border-box
    color: #FFF
    font-size: 16px
    font-weight: 400
    height: 28px
    letter-spacing: 0.4px
    line-height: 28px
    margin-bottom: 8px
    padding: 0 6px
    width: 100%

    &::placeholder
      color: #9FA8DA
      opacity: 1
    &:-ms-input-placeholder
      color: #9FA8DA
    &::-ms-input-placeholder
      color: #9FA8DA

  button.new
    background-color: transparent
    border-radius: 4px
    border: 1px solid #C5CAE9
    color: #7986CB
    cursor: pointer
    font-size: 14px
    font-weight: 300
    height: 30px
    margin-top: 32px
    width: 100%

    &:hover
      color: #303F9F
      border: 1px solid #9FA8DA

    &:active
      color: #5C6BC0
      border: 1px solid #7986CB
</style>
