<template>
  <TopMenu />

  <div class='loading'>
    <div class='board-name'>
      {{ boardName }}
    </div>
    <p>Sync Issues. Wait please...</p>
    <div v-if='isLoading || isSyncing' class='loader' />
    <div v-if='isNotFound' class='not-found'>Not Found</div>
    <div v-if='isLoaded' class='linked-repositories'>
      <h2 class='subtitle'>Linked Repositories</h2>
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
              <div v-if='isSynced(item.id)'>
                {{ syncedIssues(item.id) }}
              </div>
              <div v-else class='syncing'>
                syncing
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/menu/top.vue';
import { get, call } from 'vuex-pathify';

export default {
  name: 'BoardSync',
  components: {
    TopMenu
  },
  data: () => ({}),
  computed: {
    boards: get('user/boards'),
    isLoading: get('boardSync/isLoading'),
    isLoaded: get('boardSync/isLoaded'),
    isSyncing: get('boardSync/isSyncing'),
    isNotFound: get('boardSync/isNotFound'),
    repositories: get('boardSync/repositories'),
    syncedRepositories: get('boardSync/syncedRepositories'),
    boardId() { return parseInt(this.$route.params.id) || 0; },
    boardName() {
      const board = this.boards.find(v => v.id === this.boardId);
      return board?.name || this.$route.query?.name || 'Board';
    }
  },
  async created() {
    await this.fetchProfileLazy();
    await this.fetch({ id: this.boardId });
    await this.sync({ id: this.boardId });
    this.reset();
    this.$router.push({ name: 'board', params: { id: this.boardId } });
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'boardSync/fetch',
      'boardSync/reset',
      'boardSync/sync'
    ]),
    isSynced(repositoryId) {
      return this.syncedRepositories
        .find(v => v.id == repositoryId) != null;
    },
    syncedIssues(repositoryId) {
      const repo = this.syncedRepositories.find(v => v.id == repositoryId);
      if (repo == null) { return 0; }
      return repo.issuesCount;
    }
  }
}
</script>

<style scoped lang='sass'>
.loading
  padding-top: 80px
  text-align: center

  .board-name
    font-size: 34px
    font-weight: 500

  p
    color: #3F51B5
    font-size: 16px
    font-weight: 300
    margin-bottom: 16px

  .loader
    margin: 0 auto
    background-image: url('../assets/page_loader.svg')
    background-repeat: no-repeat
    background-size: contain
    height: 48px
    width: 48px

  .linked-repositories
    margin: 18px auto
    text-align: left
    width: 400px

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

          .syncing
            color: #757575
            font-weight: 300
</style>
