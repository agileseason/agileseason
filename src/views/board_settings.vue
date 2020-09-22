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
          <Repository
            v-for='item in installationItems'
            :key='item.id'
            :name='item.account.login'
            :avatarUrl='item.account.avatarUrl'
            :installationId='item.id'
            :installationAccessTokenUrl='item.accessTokensUrl'
            :selected-repository-ids='selectedRepositoryIds(item.id)'
            @done='done'
          />
        </div>
        <p>
          Couldn't find a repository?<br>
          Manage your installation settings
        </p>
        <Button
          type='outline'
          text='Configure App'
          :href='appUrl'
          :isDisabled='isSyncingIssues'
          :isLoading='isLoading'
        />
      </div>
      <div class='right'>
        <h2 class='subtitle'>Linked Repositories</h2>
        <div class='linked-repositories'>
          <table>
            <thead>
              <th>Name</th>
              <th class='issues'>Issues</th>
            </thead>
            <tbody>
              <tr v-for='item in repositories' :key='item.id'>
                <td class='name'>
                  {{ item.fullName }}
                </td>
                <td class='issues'>
                  {{ item.issuesCount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button
          text='Save & Sync Issues'
          @click='syncIssues'
          :isDisabled='isSyncingIssues'
          :isLoading='isLoading'
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
import Repository from '@/components/repositories/item.vue'
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
    Repository,
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
    repositories: get('boardSettings/repositories'),
    pendingRepositories: get('boardSettings/pendingRepositories'),
    installationItems: get('installations/items'),
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
      'boardSettings/fetch',
      'boardSettings/update'
    ]),
    selectTab(item) {
      this.active = item;
    },
    selectedRepositoryIds(installationId) {
      return this.pendingRepositories
        .filter(v => v.installationId === installationId)
        .map(v => v.id);
    },
    done(data) {
      this.update(data);
    },
    syncIssues() {
      console.log('sync issues...');
    },
    beforeDestroy() {
      console.log('destroy...');
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
    margin-top: 0
    margin-bottom: 18px

  .all-repositories
    margin-bottom: 30px
    width: 270px

  .linked-repositories
    margin-bottom: 18px
    min-width: 300px

    table
      border-spacing: 0
      width: 100%

      th
        color: #3F51B5
        text-align: left
        padding-bottom: 6px
        border-bottom: 1px solid #E0E0E0

        &.issues
          text-align: right

      td
        border-bottom: 1px solid #E0E0E0
        color: #424242
        padding: 8px 0 9px 0

        &.issues
          min-width: 120px
          text-align: right

  p
    color: #616161
    font-size: 12px
    letter-spacing: 0.2px
    margin-bottom: 16px
</style>
