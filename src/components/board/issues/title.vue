<template>
  <div v-if='!isEdit' class='title'>
    <span>
      {{ title }}&nbsp;
      <a :href='url'>#{{ number }}</a>
    </span>
    <div class='icon edit' @click='startEditTitle' />
  </div>
  <div v-else class='title-edit'>
    <input type='text' @keyup.enter='save' />
    <Button
      type='outline'
      size='small'
      text='Save'
      @click='save'
    />
    <Button
      type='white'
      size='small'
      text='Cancel'
      @click='cancel'
    />
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'

export default {
  components: {
    Button
  },
  props: {
    // modelValue: { type: String, required: true },
    title: { type: String, default: '...' },
    url: { type: String, default: '' },
    number: { type: [String, Number], default: '' }
  },
  data: () => ({
    isEdit: false
  }),
  methods: {
    startEditTitle() {
      this.isEdit = true;
    },
    save() {
      console.log('save');
      this.isEdit = false;
    },
    cancel() {
      console.log('cancel');
      //this.$emit('update:modelValue', this.title);
      this.isEdit = false;
    }
  }
}
</script>

<style scoped lang='sass'>
.title-edit
  height: 24px
  margin-bottom: 12px
  display: flex

.title
  font-size: 20px
  font-weight: 500
  margin-bottom: 12px
  display: flex
  justify-content: space-between
  align-items: center

  a
    color: #2196f3
    font-weight: 400

  .edit
    background-image: url('../../../assets/icons/issue/edit.svg')
    background-position: center
    background-repeat: no-repeat

// TODO: Extract the icon component
.icon
  cursor: pointer
  height: 12px
  padding: 6px
  width: 12px

  &:hover
    opacity: 0.7

  &:active
    opacity: 0.9
</style>
