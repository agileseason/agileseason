<template>
  <div class='issue'>
    <div class='issue-header'>
      <span class='icon' />
      <span class='title'>New Issue</span>
      <div class='close' @click='close' />
    </div>
    <div class='issue-body'>
      <div class='left'>
        <img class='avatar' :src='avatarUrl' />

        <input type='text' class='title' v-model.trim='title' placeholder='Title' ref='title' />
        <textarea
          class='body'
          v-model='body'
          placeholder='Leave a comment...'
        />

        <div class='actions'>
          <Button
            text='Submit new issue'
            @click='submit'
            :is-loading='isSubmitting'
            :is-disabled='!isValid'
          />
        </div>
      </div>

      <div class='right'>
        <div class='repositories radios'>
          <label class='label'>Repositories</label>
          <div v-for='repo in repositories' class='repository radio' :key='repo.id'>
            <input
              v-model='selectedRepositoryId'
              type='radio'
              :value='repo.id'
              :id='repo.id'
            />
            <label :for='repo.id' :title='repo.fullName'>
              {{ repo.name }}
            </label>
          </div>
        </div>

        <div class='delimeter' />

        <div class='assigness'>
          <label class='label active'>Assigness<span class='gear' /></label>
          TODO
        </div>

        <div class='delimeter' />

        <div class='labels'>
          <label class='label active'>Labels<span class='gear' /></label>
          TODO
        </div>

        <div class='delimeter' />

        <div class='colors'>
          <label class='label active'>Colors<span class='gear' /></label>
          TODO
        </div>

        <div class='delimeter' />

        <div class='columns radios'>
          <label class='label'>Columns</label>
          <div v-for='column in columns' class='column radio' :key='column.id'>
            <input
              v-model='selectedColumnId'
              type='radio'
              :value='column.id'
              :id='column.id'
            />
            <label :for='column.id'>
              {{ column.name }}
            </label>
          </div>
        </div>

        <div class='delimeter' />

        <div class='positions radios'>
          <label class='label'>Position</label>
          <div v-for='position in positions' class='position radio' :key='position'>
            <input
              v-model='selectedPosition'
              type='radio'
              :value='position'
              :id='position'
            />
            <label :for='position'>
              {{ position.substr(0, 1).toUpperCase() + position.substr(1).toLowerCase() }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'
import { get, call } from 'vuex-pathify';

const delay = require('delay');

export default {
  name: 'IssueNew',
  components: {
    Button
  },
  props: {
    columnId: { type: Number, required: true }
  },
  data: () => ({
    title: '',
    body: '',
    selectedRepositoryId: undefined,
    selectedColumnId: undefined,
    selectedPosition: undefined,

    isSubmitting: false
  }),
  computed: {
    username: get('user/username'),
    avatarUrl: get('user/avatarUrl'),
    repositories: get('board/repositories'),
    columns: get('board/columns'),
    positions() { return ['top', 'bottom']; },
    isValid() {
      return this.title.length > 0;
    }
  },
  created() {
    this.selectedRepositoryId = this.repositories[0].id;
    this.selectedColumnId = this.columnId;
    this.selectedPosition = this.positions[0];
  },
  async mounted() {
    await delay(300);
    this.$nextTick(() => this.$refs.title.focus());
  },
  methods: {
    ...call([
      'issue/fetch',
      'issue/fetchComments'
    ]),
    close() { this.$emit('close'); },
    submit() {
      this.isSubmitting = true;
      console.log('submit new issue');
      console.log(this.title + ' ' + this.body);
    }
  }
}
</script>

<style scoped lang='sass'>
.issue-header
  border-bottom: 1px solid #c5cae9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px
  position: relative

  .icon
    background-image: url('../../assets/icons/issue/green_open.svg')
    background-position-y: center
    background-repeat: no-repeat
    display: inline-block
    height: 24px
    margin-right: 10px
    width: 16px

  .title
    font-weight: 500
    line-height: 24px
    vertical-align: top

  .close
    background-image: url('../../assets/icons/issue/x_close.svg')
    background-position: center
    background-repeat: no-repeat
    cursor: pointer
    float: right
    height: 10px
    padding: 6px
    width: 10px

    &:hover
      opacity: 0.7

    &:active
      opacity: 0.9

.issue-body
  position: relative
  padding-bottom: 40px

  .avatar
    width: 40px
    height: 40px
    border-radius: 20px
    background: #eee
    position: absolute
    left: 14px
    top: 14px

  input.title
    border-radius: 3px
    border: 1px solid #c5cae9
    box-sizing: border-box
    font-size: 20px
    font-weight: 300
    height: 34px
    margin: 16px 0 14px 64px
    padding: 0 8px
    width: calc(100% - 64px) // 100% - margin-left

    &::placeholder
      color: #7986cb
      opacity: 1
    &:-ms-input-placeholder
      color: #7986cb
    &::-ms-input-placeholder
      color: #7986cb

  textarea.body
    border-radius: 3px
    border: 1px solid #c5cae9
    box-sizing: border-box
    font-size: 16px
    font-weight: 300
    margin-left: 64px
    padding: 8px
    width: calc(100% - 64px) // 100% - margin-left
    min-height: 200px
    resize: none

    &::placeholder
      color: #9fa8da
      opacity: 1
    &:-ms-input-placeholder
      color: #9fa8da
    &::-ms-input-placeholder
      color: #9fa8da

  .left,
  .right
    display: inline-block

  .left
    width: calc(100% - 220px)

  .right
    box-sizing: border-box
    margin-top: 16px
    padding: 0 14px 0 30px
    vertical-align: top
    width: 220px

  .actions
    text-align: right
    margin-top: 12px

    .button
      min-width: 170px

  label.label
    color: #283593
    display: block
    font-weight: 700
    margin-bottom: 6px
    position: relative

    &.active
      cursor: pointer

      &:hover
        opacity: 0.8

    .gear
      background-image: url('../../assets/icons/issue/gear.svg')
      background-position: center
      background-repeat: no-repeat
      cursor: pointer
      height: 10px
      width: 10px
      position: absolute
      right: 0
      top: 4px

  .radios
    .radio
      align-items: center
      cursor: pointer
      display: flex
      margin-bottom: 6px

      &:last-child
        margin-bottom: 0px

      input
        cursor: pointer
        margin: 0

      label
        cursor: pointer
        margin-left: 6px

  .delimeter
    border-bottom: 1px solid #e8eaf6
    padding-top: 12px
    margin-bottom: 12px
</style>
