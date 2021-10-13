<template>
  <div>
    <TopMenu :breadCrumbs="[{ name: 'Boards', path: '/boards' }]" title='New' />

    <div class='steps'>
      <div class='step'>
        <div class='title'>1. Install Application</div>
        <div class='subtitle'>
          GitHub App
          <a href='https://github.com/apps/agileseason' target='_blank'>
            @agileseason
          </a>
        </div>

        <div v-if='isInstalled' class='configure-block'>
          <p>
            Couldn't find a repository?<br>
            Manage your installation settings
          </p>
          <Button
            type='outline'
            class='configure'
            text='Configure App'
            :href='appUrl'
            :isDisabled='isSubmitting'
          />
        </div>
        <Button
          v-else
          class='install'
          :href='appUrl'
          :isLoading='isLoading'
          :isDisabled='isSubmitting'
          text='Install App'
        />
      </div>

      <div v-if='isInstalled' class='step'>
        <div class='title'>2. Select Repositories</div>
        <Repository
          v-for='item in items'
          :key='item.id'
          :name='item.account.login'
          :avatarUrl='item.account.avatarUrl'
          :installationId='item.id'
          :installationAccessTokenUrl='item.accessTokensUrl'
          :selected-repository-ids='selectedRepositoryIds(item.id)'
          @done='done'
        />
        <!--div class='selected-repositories'>
          <span
            v-for='repo in selectedRepositories'
            :key='repo.id'
            class='repository tag'
            @click='removeSelectedRepository(repo.id)'
          >
            <span>{{ repo.name }}</span>
            <span class='icon' />
          </span>
        </div-->
      </div>
      <div v-else class='step disabled'>
        <div class='title'>2. Select Repositories</div>
      </div>

      <div v-if='isImportReady' class='step'>
        <div class='title'>3. Import Issues</div>
        <Input
          v-model.trim='boardName'
          placeholder='Board Name'
          class='board-name'
        />
        <div class='selected-repositories imported-repositories'>
          <span
            v-for='repo in selectedRepositories'
            :key='repo.id'
            :title='repo.fullName'
            class='repository tag'
            @click='removeSelectedRepository(repo.id)'
          >
            <span>{{ repo.name }}</span>
            <span class='icon' />
          </span>
        </div>
        <Button
          class='finish'
          :isLoading='isSubmitting'
          :isDisabled='isDisabledFinished'
          text='Finish'
          @click='finish'
        />
      </div>
      <div v-else class='step disabled'>
        <div class='title'>3. Import Issues</div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button';
import TopMenu from '@/components/menu/top';
import Repository from '@/components/repositories/item';
import Input from '@/components/inputs/indigo';
import { get, call } from 'vuex-pathify';

const APP_URL = {
  development: 'https://github.com/apps/agileseason-dev/installations/new',
  production: 'https://github.com/apps/agileseason/installations/new'
}[process.env.NODE_ENV];

export default {
  name: 'BoardNew',
  components: {
    Button,
    Input,
    Repository,
    TopMenu
  },
  data: () => ({
    boardName: '',
    isInstalled: false
  }),
  computed: {
    isLoading: get('installations/isLoading'),
    isSubmitting: get('boardNew/isSubmitting'),
    isImportReady: get('boardNew/isImportReady'),
    items: get('installations/items'),
    selectedRepositories: get('boardNew/selectedRepositories'),
    appUrl() { return APP_URL; },
    isDisabledFinished() { return this.boardName === ''; }
  },
  async created() {
    const items = await this.fetch();
    if (items?.length > 0) {
      this.isInstalled = true;
    }
  },
  methods: {
    ...call([
      'installations/fetch',
      'boardNew/remove',
      'boardNew/submit',
      'boardNew/update'
    ]),
    selectedRepositoryIds(installationId) {
      return this.selectedRepositories
        .filter(v => v.installationId === installationId)
        .map(v => v.id);
    },
    removeSelectedRepository(repositoryId) {
      this.remove(repositoryId);
    },
    done(data) {
      // { installationId, installationAccessTokenUrl, repositories }
      this.update(data);
    },
    async finish() {
      if (this.isSubmitting) { return; }

      const board = await this.submit({ boardName: this.boardName });
      if (board?.id != null) {
        this.$router.push({
          name: 'board_sync',
          params: { id: board.id },
          query: { name: board.name }
        });
      } else {
        console.error('error');
      }
    }
  }
}
</script>

<style scoped lang='sass'>
.steps
  display: flex
  justify-content: center

.step
  background-color: #fff
  border-radius: 6px
  box-sizing: border-box
  margin: 45px 16px 0
  min-height: 300px
  padding: 32px 16px 26px
  text-align: center
  width: 320px

  &.disabled
    background-color: #c5cae9

    .title
      color: #7986cb

  .title
    color: #212121
    font-size: 14px
    font-weight: 500
    margin-bottom: 14px

  .subtitle
    font-size: 14px

    a
      color: #2196f3
      font-weight: 500
      text-decoration: none

      &:hover
        text-decoration: underline

      &:visited
        color: #2196f3

  .button.install
    min-width: 150px
    margin-top: 136px

  .button.finish
    min-width: 150px

  .configure-block
    margin-top: 116px

    p
      color: #616161
      font-size: 12px
      letter-spacing: 0.2px

    .button.configure
      min-width: 150px

.selected-repositories
  margin-top: 12px
  text-align: left

  .tag
    background-color: #3f51b5
    border-radius: 14px
    color: #fff
    cursor: pointer
    display: inline-block
    font-size: 12px
    letter-spacing: 0.3px
    margin-bottom: 6px
    margin-right: 6px
    padding: 4px 8px

    &:hover
      background-color: #303f9f

    &:active
      background-color: #5c6bc0

    .icon
      background-image: url('../assets/icons/x.svg')
      background-repeat: no-repeat
      background-size: contain
      margin-left: 6px
      display: inline-block
      height: 8px
      width: 8px

.imported-repositories.selected-repositories
  height: 118px
  margin-top: 0

.imported-repositories
  height: 106px
  overflow-x: hidden
  overflow-y: scroll
  text-align: left
  margin-bottom: 6px

.board-name
  margin-bottom: 20px
  width: 100%
</style>
