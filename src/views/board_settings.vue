<template>
  <TopMenu
    title='Settings'
    :breadCrumbs='breadCrumbs'
  />
  <Tabs
    :items='tabs'
    :active='active'
    @select='selectTab'
  />
  <div class='body'>
    <div v-if='isLoading' class='loading'>Loading...</div>
    <div v-if='isNotFound' class='not-found'>Not Found</div>
    <div v-if='active === "General" && isLoaded'>
      TODO: {{ active }}
    </div>
    <div v-if='active === "Repositories" && isLoaded'>
      <div class='left'>
        <h2 class='subtitle'>All your Repositories</h2>
        <div class='all-repositories'>
          TODO: {{ active }}
        </div>
        <p>
          Couldn't find a repository?<br>
          Manage your installation settings
        </p>
        <Button
          text='Configure App'
          :href='appUrl'
          :isDisabled='isSyncingIssues'
        />
      </div>
      <div class='right'>
        <h2 class='subtitle'>Linked Repositories</h2>
        <div class='linked-repositories'>
          TODO: {{ active }}
        </div>
        <Button
          type='outline'
          text='Sync Issues'
          @click='syncIssues'
          :isDisabled='isSyncingIssues'
        />
      </div>
    </div>
    <div v-if='active === "Members" && isLoaded'>
      TODO: {{ active }}
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'
import Tabs from '@/components/tabs/tabs.vue'
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

const APP_URL = {
  development: 'https://github.com/apps/agileseason-dev/installations/new',
  production: 'https://github.com/apps/agileseason/installations/new'
}[process.env.NODE_ENV];

export default {
  name: 'BoardSettings',
  components: {
    Button,
    Tabs,
    TopMenu
  },
  data: () => ({
    tabs: [
      'General',
      'Repositories',
      'Members'
    ],
    active: 'Repositories'
    // active: 'General'
  }),
  computed: {
    isLoaded: get('boardSettings/isLoaded'),
    isLoading: get('boardSettings/isLoading'),
    isNotFound: get('boardSettings/isNotFound'),
    isSyncingIssues: get('boardSettings/isSyncingIssues'),
    token: get('user/token'),
    boards: get('user/boards'),
    boardId() { return parseInt(this.$route.params.id) || 0; },
    breadCrumbs() {
      const board = this.boards.find(v => v.id === this.boardId);
      if (board == null) {
        return [
          { name: 'Boards', path: '/boards' }
        ];
      }

      return [
        { name: 'Boards', path: '/boards' },
        { name: board.name, path: `/boards/${this.boardId}` }
      ];
    },
    appUrl() { return APP_URL; }
  },
  async created() {
    await this.fetch({ id: this.boardId });
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'boardSettings/fetch'
    ]),
    selectTab(item) {
      this.active = item;
    },
    syncIssues() {
      console.log('sync issues...');
    }
  }
}
</script>

<style scoped lang='sass'>
.body
  background-color: #FFF
  box-sizing: border-box
  height: calc(100vh - 101px)
  padding: 30px 20px

  .left,
  .right
    display: inline-block
    vertical-align: top

  .left
    margin-right: 100px

  h2.subtitle
    font-size: 18px
    font-weight: 600
    margin-bottom: 18px

  .all-repositories
    margin-bottom: 30px
    width: 270px

  .linked-repositories
    margin-bottom: 18px
    width: 300px

  p
    color: #616161
    font-size: 12px
    letter-spacing: 0.2px
    margin-bottom: 12px
</style>
