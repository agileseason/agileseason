<template>
  <div>
    <TopMenu title='New Board' />

    <div class='steps'>
      <div class='step step-1'>
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
        <input class='board-name' type='text' v-model.trim='boardName' placeholder='Board Name' />
        <!--div class='imported-repositories'>
          <div
            v-for='repo in selectedRepositories'
            :key='repo.id'
            class='github-repository'
          >
            <input
              v-model='importedRepositoryIds'
              type='checkbox'
              :value='repo.id'
              :id='repo.id'
            />
            <label :for='repo.id'>{{ repo.fullName }}</label>
          </div>
        </div-->
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
import Button from '@/components/buttons/button.vue'
import TopMenu from '@/components/menu/top.vue'
import Repository from '@/components/repositories/item.vue'
import { get, call } from 'vuex-pathify';

const APP_URL = {
  development: 'https://github.com/apps/agileseason-dev/installations/new',
  production: 'https://github.com/apps/agileseason/installations/new'
}[process.env.NODE_ENV];

export default {
  name: 'BoardNew',
  components: {
    Button,
    Repository,
    TopMenu
  },
  data: () => ({
    boardName: 'Board Name',
    // importedRepositoryIds: [],
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
  // watch: {
  //   selectedRepositories: function() {
  //     this.importedRepositoryIds = this.selectedRepositories.map(v => v.id);
  //   },
  //   importedRepositoryIds: function() {
  //     this.syncImportedRepositoryIds(this.importedRepositoryIds);
  //   }
  // },
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
          name: 'board',
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
  text-align: center

.step
  background-color: #FFFFFF
  border-radius: 6px
  box-sizing: border-box
  display: inline-block
  margin: 45px 16px 0
  min-height: 280px
  padding: 32px 16px 26px
  vertical-align: top
  width: 320px

  &.step-1
    height: 280px

  &.disabled
    background-color: #C5CAE9

    .title
      color: #7986CB

  .title
    color: #212121
    font-size: 14px
    font-weight: 600
    margin-bottom: 14px

  .subtitle
    color: #303F9F
    font-size: 14px

    a
      font-weight: 500
      text-decoration: none

      &:hover
        text-decoration: underline

      &:visited
        color: #303F9F

  .button.install
    min-width: 150px
    margin-top: 136px

  .button.finish
    min-width: 150px

  .configure-block
    p
      color: #616161
      font-size: 12px
      letter-spacing: 0.2px
      margin: 92px 0 16px

    .button.configure
      min-width: 150px

.selected-repositories
  margin-top: 12px
  text-align: left

  .tag
    background-color: #3F51B5
    border-radius: 14px
    color: #FFF
    cursor: pointer
    display: inline-block
    font-size: 12px
    letter-spacing: 0.3px
    margin-bottom: 6px
    margin-right: 6px
    padding: 4px 8px

    &:hover
      background-color: #303F9F

    &:active
      background-color: #5C6BC0

    .icon
      background-image: url('../assets/icons/x.svg')
      background-repeat: no-repeat
      background-size: contain
      margin-left: 6px
      display: inline-block
      height: 8px
      width: 8px

.imported-repositories.selected-repositories
  height: 98px
  margin-top: 0

.imported-repositories
  height: 106px
  overflow-x: hidden
  overflow-y: scroll
  text-align: left
  margin-bottom: 6px

  .github-repository
    margin-bottom: 8px
    white-space: nowrap

  input
    margin: 0px 6px 0px 2px

  label
    color: #212121

input.board-name
  background-color: #C5CAE9
  border-radius: 3px
  border: 1px solid #C5CAE9
  box-sizing: border-box
  color: #1A237E
  font-size: 16px
  font-weight: 300
  height: 28px
  letter-spacing: 0.4px
  line-height: 28px
  margin-bottom: 20px
  padding: 0 6px
  width: 100%

  &::placeholder
    color: #7986CB
    opacity: 1
  &:-ms-input-placeholder
    color: #7986CB
  &::-ms-input-placeholder
    color: #7986CB
</style>
