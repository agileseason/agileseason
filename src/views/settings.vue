<template>
  <TopMenu title='Account settings' />

  <Loader v-if='!isLoaded' />
  <Tabs
    v-if='isLoaded'
    :items='tabs'
    :active='active'
    @select='selectTab'
  />
  <article v-if='active === "Appearance"' class='body'>
    <h2 class='subtitle'>Issue modal position</h2>
    <div
      v-for='item in issueModalStyles'
      class='radio-item'
      :key='item'
    >
      <input
        v-model='selectedIssueModalStyle'
        type='radio'
        :value='item'
        :id='item'
      />
      <label :for='item'>
        {{ item }}
        <span class='note'>{{issueModalStyleNotes[item]}}</span>
      </label>
    </div>
  </article>
</template>

<script>
import Loader from '@/components/loader';
import Tabs from '@/components/tabs/tabs';
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
    Loader,
    Tabs,
    TopMenu
  },
  data: () => ({
    tabs: [
      'Appearance'
    ],
    active: 'Appearance',
    issueModalStyles: [
      'center',
      'right',
    ],
    issueModalStyleNotes: {
      center: 'Best for laptop (default)',
      right: 'Best for wide monitor',
    },
    selectedIssueModalStyle: undefined,
  }),
  computed: {
    isLoaded: get('user/isLoaded'),
    issueModalStyle: get('user/issueModalStyle'),
    token: get('user/token'),
    boards: get('user/boards')
  },
  watch: {
    selectedIssueModalStyle(newValue) {
      this.updateIssueModelStyle({ issueModalStyle: newValue });
    }
  },
  async created() {
    const user = await this.fetchProfile();
    if (user == null) {
      this.$router.push({ name: 'home' });
    } else if (user.boards.length === 0) {
      this.$router.push({ name: 'board_new' });
    }
    this.selectedIssueModalStyle = this.issueModalStyle;
  },
  methods: {
    ...call([
      'user/fetchProfile',
      'user/updateIssueModelStyle'
    ]),
    selectTab(item) {
      this.active = item;
    },
  }
}
</script>

<style scoped lang='sass'>
.body
  background-color: #FFF
  box-sizing: border-box
  height: calc(100vh - 101px)
  padding: 30px 20px

article
  margin-bottom: 50px

  h2.subtitle
    font-size: 18px
    font-weight: 500
    margin-top: 0
    margin-bottom: 16px

.radio-item
  display: flex
  align-items: center
  margin-bottom: 4px

  input,
  label,
  span
    cursor: pointer

  input
    margin: 0 4px 0 0

  label
    text-transform: capitalize

  .note
    color: #9E9E9E
    margin-left: 4px
    text-transform: none
</style>
