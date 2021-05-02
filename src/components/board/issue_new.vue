<template>
  <div class='issue'>
    <div class='issue-header'>
      <span class='icon' />
      <span class='title'>New Issue</span>
      <div class='close' @click='close' />
    </div>

    <IssueBody>
      <div class='left'>
        <img class='avatar' :src='avatarUrl' />

        <input
          type='text'
          class='title'
          v-model.trim='title'
          placeholder='Title'
          ref='title'
          @keyup.enter='submit'
        />
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
          <div
            v-for='repo in repositories'
            class='repository radio'
            :key='repo.id'
          >
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
        <Assignees
          :assignees='assignees'
          :repositoryFullName='selectedRepositoryFullName'
          @assign='assign'
        />

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
          <div
            v-for='column in columns'
            class='column radio'
            :key='column.id'
          >
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
    </IssueBody>
  </div>
</template>

<script>
import Assignees from '@/components/board/issues/assignees.vue'
import Button from '@/components/buttons/button.vue'
import IssueBody from '@/components/board/issues/body_content.vue'
import { get, call } from 'vuex-pathify';

const delay = require('delay');

export default {
  name: 'IssueNew',
  components: {
    Assignees,
    Button,
    IssueBody
  },
  props: {
    columnId: { type: Number, required: true }
  },
  data: () => ({
    title: '',
    body: '',
    assignees: [],
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
    },
    selectedRepositoryFullName() {
      return this.repositories
        .find(v => v.id === this.selectedRepositoryId)
        ?.fullName;
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
      'issue/fetchComments',
      'board/createIssue'
    ]),
    close() { this.$emit('close'); },
    async submit() {
      if (this.isSubmitting) { return; }

      this.isSubmitting = true;
      const issue = await this.createIssue({
        columnId: this.selectedColumnId,
        repositoryId: this.selectedRepositoryId,
        title: this.title,
        body: this.body,
        assignees: this.assignees,
        position: this.selectedPosition
      });
      // console.log(issue);
      this.isSubmitting = false;
      if (issue) {
        this.title = '';
        this.body = '';
        this.close();
      }
    },
    assign(user) {
      const userIndex = this.assignees.findIndex(v => v.login === user.login);
      if (userIndex === -1) {
        this.assignees.push(user);
      } else {
        this.assignees.splice(userIndex, 1);
      }
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

.left
  position: relative

  .avatar
    width: 40px
    height: 40px
    border-radius: 20px
    background: #eee
    position: absolute
    left: 0
    top: 0

input.title
  border-radius: 3px
  border: 1px solid #c5cae9
  box-sizing: border-box
  font-size: 20px
  font-weight: 300
  height: 34px
  margin: 4px 0 14px 50px
  padding: 0 8px
  width: calc(100% - 50px) // 100% - margin-left

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
  margin-left: 50px
  padding: 8px
  width: calc(100% - 50px) // 100% - margin-left
  min-height: 200px
  resize: none

  &::placeholder
    color: #9fa8da
    opacity: 1
  &:-ms-input-placeholder
    color: #9fa8da
  &::-ms-input-placeholder
    color: #9fa8da

.right
  margin-top: 16px
  vertical-align: top

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
