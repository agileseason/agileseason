<template>
  <div class='repository'>
    <div v-if='!isSelected' class='inner' @click='open'>
      <img :src='avatarUrl' />
      <span class='login'>{{ name }}</span>
      <span class='icon' />
    </div>
    <div v-else class='inner-active'>
      <div class='header'>
        <img :src='avatarUrl' />
        <span class='login'>{{ name }}</span>
      </div>
      <div class='list'>
        <input class='search' type='text' v-model='search' placeholder='Search...' />
        <div>
          TODO
        </div>
        <div class='actions'>
          <Button @click='close' type='flat' text='Close' />
          <Button @click='done' type='white' text='Done' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'

export default {
  name: 'Repository',
  components: {
    Button
  },
  props: {
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
  },
  data: () => ({
    search: '',
    isSelected: false
  }),
  computed: {
  },
  methods: {
    open() {
      this.isSelected = true;
      console.log('open');
    },
    done() {
      this.isSelected = false;
      console.log('done');
    },
    close() {
      this.isSelected = false;
      console.log('close');
    }
  }
};
</script>

<style scoped lang='sass'>
.repository
  .inner
    border-radius: 3px
    border: 1px solid #E0E0E0
    color: #424242
    cursor: pointer
    height: 36px
    margin-bottom: 8px
    position: relative
    text-align: left
    box-sizing: border-box

    &:hover
      background-color: #F5F5F5
      color: #303F9F

    .icon
      background-image: url('../../assets/icons/right.svg')
      background-position: right
      background-repeat: no-repeat
      background-size: 10px
      display: inline-block
      height: 34px
      position: absolute
      right: 8px
      width: 10px

  .inner-active
    background-color: #3F51B5
    border-radius: 3px
    border: 1px solid #3F51B5
    color: #FFF
    text-align: left

    .list
      padding: 0 8px 8px

      .actions
        border-top: 1px solid #7986CB
        text-align: right
        padding-top: 8px

        .button
          margin-left: 8px

  .login
    display: inline-block
    font-size: 14px
    line-height: 32px
    vertical-align: top

input.search
  background-color: #5C6BC0
  border-radius: 3px
  border: 1px solid #5C6BC0
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
    color: #7986CB
    opacity: 1
  &:-ms-input-placeholder
    color: #7986CB
  &::-ms-input-placeholder
    color: #7986CB

img
  border-radius: 12px
  height: 24px
  width: 24px
  margin: 5px 6px
</style>
