<template>
  <div v-if='!isEdit' class='title'>
    <span>
      {{ title }}&nbsp;
      <a :href='url'>#{{ number }}</a>
    </span>
    <ButtonIcon name='edit' @click='startEditTitle' />
  </div>
  <div v-else class='title-edit'>
    <input
      type='text'
      @keyup.enter='save'
      v-model='newTitle'
      ref='title'
    />
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
import ButtonIcon from '@/components/buttons/icon.vue'

export default {
  components: {
    Button,
    ButtonIcon
  },
  props: {
    // modelValue: { type: String, required: true },
    // <input
    //   type='text'
    //   @keyup.enter='save'
    //   @input="$emit('update:modelValue', $event.target.value)"
    // />
    title: { type: String, default: '...' },
    url: { type: String, default: '' },
    number: { type: [String, Number], default: '' }
  },
  data: () => ({
    newTitle: '',
    isEdit: false
  }),
  methods: {
    startEditTitle() {
      this.newTitle = this.title;
      this.isEdit = true;
      this.$nextTick(() => this.$refs.title.focus());
    },
    save() {
      this.isEdit = false;
      this.$emit('save', this.newTitle);
    },
    cancel() {
      this.newTitle = this.title;
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

  input
    margin-right: 12px
    flex-grow: 1

    border-radius: 3px
    border: 1px solid #c5cae9
    box-sizing: border-box
    font-size: 16px
    font-weight: 300
    padding: 4px 4px

    &::placeholder
      color: #7986cb
      opacity: 1
    &:-ms-input-placeholder
      color: #7986cb
    &::-ms-input-placeholder
      color: #7986cb

.title
  font-size: 20px
  font-weight: 500
  margin-bottom: 12px
  display: flex
  justify-content: space-between
  align-items: center
  padding-right: 10px

  a
    color: #2196f3
    font-weight: 400

.button + .button
  margin-left: 10px
</style>
