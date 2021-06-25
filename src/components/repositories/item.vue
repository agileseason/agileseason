<template>
  <div class='repository'>
    <div v-if='!isSelected' class='inner' @click='open'>
      <div class='left'>
        <img :src='avatarUrl' />
        <span class='login'>{{ name }}</span>
      </div>
      <div class='right'>
        <span v-if='selectedRepositoryIds.length > 0' class='count'>{{ selectedRepositoryIds.length }}</span>
        <span class='icon' />
      </div>
    </div>
    <Dialog v-else class='dialog' @close='isSelected = false'>
      <div class='header'>
        <img :src='avatarUrl' />
        <span class='login'>{{ name }}</span>
      </div>
      <div class='body'>
        <input
          class='search'
          type='text'
          v-model.trim='search'
          placeholder='Search...'
          ref='search'
        />

        <div v-if='isLoading'>
          Loading...
        </div>

        <div v-if='!isLoading' class='items-container'>
          <div
            v-for='repo in visibleItems'
            :key='repo.id'
            class='github-repository'
          >
            <label class='checkbox' title='repo.fullName'>
              <input
                v-model='selectedItems'
                type='checkbox'
                :value='repo.id'
              />
              {{ repo.name }}
            </label>
          </div>
          <div v-if='isNotFound' class='not-found'>
            No results matched your search
          </div>
        </div>
      </div>
      <template #actions>
        <Button @click='close' type='flat' text='Close' />
        <Button @click='done' type='white' text='Done' />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Button from '@/components/buttons/button'
import Dialog from '@/components/dialog'
import { call } from 'vuex-pathify';

export default {
  name: 'Repository',
  components: {
    Button,
    Dialog
  },
  props: {
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    installationId: { type: Number, required: true },
    installationAccessTokenUrl: { type: String, required: true },
    selectedRepositoryIds: { type: Array, required: true }
  },
  data: () => ({
    search: '',
    items: [],
    selectedItems: [],
    isSelected: false,
    isLoading: true
  }),
  computed: {
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
    this.items = await this.fetch(this.installationId);
    this.isLoading = false;
  },
  methods: {
    ...call([
      'repositories/fetch',
      'boardNew/update'
    ]),
    open() {
      this.isSelected = true;
      this.$nextTick(() => this.$refs.search?.focus());
    },
    done() {
      this.isSelected = false;
      const repositories = this.items
        .filter(v => this.selectedItems.includes(v.id));
      const { installationId, installationAccessTokenUrl } = this;
      this.$emit('done', { installationId, installationAccessTokenUrl, repositories });
    },
    close() {
      this.isSelected = false;
    }
  }
};
</script>

<style scoped lang='sass'>
.repository
  position: relative

  .inner
    border-radius: 3px
    border: 1px solid #e0e0e0
    color: #424242
    cursor: pointer
    margin-bottom: 8px
    box-sizing: border-box
    padding: 8px
    display: flex
    align-items: center
    justify-content: space-between

    &:hover
      background-color: #f5f5f5
      color: #303f9f

    .left,
    .right
      display: flex
      align-items: center

    .login
      display: inline-block
      font-size: 14px

    .count
      background-color: #7986cb
      border-radius: 10px
      color: #fff
      display: inline-block
      font-size: 12px
      font-weight: 500
      padding: 3px 8px
      margin-right: 12px

    .icon
      background-image: url('../../assets/icons/right.svg')
      background-position: center
      background-repeat: no-repeat
      background-size: cover
      display: inline-block
      height: 14px
      width: 8px

  .dialog
    .header
      display: flex
      align-items: center
      margin-bottom: 8px

    .body
      .items-container
        max-height: 600px
        overflow: auto

      .not-found
        color: #c5cae9
        font-size: 14px
        font-style: italic
        font-weight: 300
        margin: 2px 0 9px

    .button + .button
      margin-left: 8px

  label.checkbox
    display: flex
    align-items: center

    input
      margin: 0 6px 0 0

input.search
  background-color: #7986cb
  border-radius: 3px
  border: 1px solid #7986cb
  box-sizing: border-box
  color: #fff
  font-size: 16px
  font-weight: 400
  height: 28px
  letter-spacing: 0.4px
  line-height: 28px
  margin-bottom: 8px
  outline: none
  padding: 0 6px
  width: 100%

  &:focus
    border-color: #fff

  &::placeholder
    color: #9fa8da
    opacity: 1
  &:-ms-input-placeholder
    color: #9fa8da
  &::-ms-input-placeholder
    color: #9fa8da

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
  margin-right: 6px
</style>
