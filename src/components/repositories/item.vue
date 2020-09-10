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
        <input class='search' type='text' v-model.trim='search' placeholder='Search...' />
        <div v-if='isLoading'>
          Loading...
        </div>
        <div class='items-container' v-else>
          <div
            v-for='repo in visibleItems'
            :key='repo.id'
            class='github-repository'
          >
            <input
              v-model='selectedItems'
              type='checkbox'
              :value='repo.id'
              :id='repo.id'
            />
            <label :for='repo.id' title='repo.fullName'>
              {{ repo.name }}
            </label>
          </div>
          <div v-if='isNotFound' class='not-found'>
            No results matched your search
          </div>
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
import { get, call } from 'vuex-pathify';

export default {
  name: 'Repository',
  components: {
    Button
  },
  props: {
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    installationId: { type: Number, required: true },
    selectedRepositoryIds: { type: Array, required: true }
  },
  data: () => ({
    search: '',
    selectedItems: [],
    isSelected: false
  }),
  computed: {
    isLoading: get('repositories/isLoading'),
    items: get('repositories/items'),
    visibleItems() {
      if (this.search === '') { return this.items; }
      return this.items
        .filter(v => v.name.toLowerCase().includes(this.search));
    },
    isNotFound() {
      if (this.search === '') { return false; }
      return this.items.length > 0 && this.visibleItems.length === 0;
    }
  },
  watch: {
    isSelected: function() {
      this.selectedItems = this.selectedRepositoryIds;
    }
  },
  async created() {
    await this.fetch(this.installationId);
  },
  methods: {
    ...call([
      'repositories/fetch',
      'boardNew/update'
    ]),
    open() {
      this.isSelected = true;
      this.$emit('selected', true);
    },
    done() {
      this.isSelected = false;
      this.$emit('selected', false);
      const repositories = this.items.filter(v => this.selectedItems.includes(v.id));
      this.update({ installationId: this.installationId, repositories });
    },
    close() {
      this.isSelected = false;
      this.$emit('selected', false);
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

      .items-container
        max-height: 600px
        overflow: auto

      .not-found
        color: #C5CAE9
        font-size: 14px
        font-style: italic
        font-weight: 300
        margin: 2px 0 9px

      .actions
        border-top: 1px solid #7986CB
        text-align: right
        padding-top: 8px

        .button
          margin-left: 8px

  .login
    display: inline-block
    font-size: 14px
    line-height: 34px
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

.github-repository
  margin-bottom: 8px
  cursor: pointer

  input
    cursor: pointer

  label
    cursor: pointer
    display: inline-block
    font-weight: 300
    margin-left: 4px
    width: 226px

img
  border-radius: 12px
  height: 24px
  width: 24px
  margin: 5px 6px
</style>
