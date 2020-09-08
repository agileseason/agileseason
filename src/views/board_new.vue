<template>
  <div>
    <TopMenu title='New Board' />

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
            Couldn't find a repository?
            <br>
            Manage your installation settings
          </p>
          <Button class='configure' text='Configure App' :href='appUrl' />
        </div>
        <Button
          v-else
          class='install'
          :isLoading='isLoading'
          :href='appUrl'
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
        />
        <div class='selected-repositories'>
          <span
            v-for='repo in selectedRepositories'
            :key='repo.id'
            class='repository'
          >
            {{ repo.name }}
          </span>
        </div>
      </div>
      <div v-else class='step disabled'>
        <div class='title'>2. Select Repositories</div>
      </div>

      <div v-if='isImportReady' class='step'>
        <div class='title'>3. Import Issues</div>
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
    isInstalled: false
  }),
  computed: {
    isLoading: get('installations/isLoading'),
    items: get('installations/items'),
    isImportReady: get('boardNew/isImportReady'),
    selectedRepositories: get('boardNew/selectedRepositories'),
    appUrl() { return APP_URL; }
  },
  async created() {
    const items = await this.fetch();
    if (items?.length > 0) {
      this.isInstalled = true;
    }
  },
  methods: {
    ...call([
      'installations/fetch'
    ])
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
  height: 242px
  margin: 45px 16px 0
  padding: 32px 16px 26px
  vertical-align: top
  width: 300px

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
    margin-top: 98px

  .configure-block
    p
      color: #616161
      font-size: 12px
      letter-spacing: 0.2px
      margin: 54px 0 16px

    .button.configure
      min-width: 150px

.selected-repositories
  margin-top: 12px
  text-align: left

  .repository
    background-color: #3F51B5
    border-radius: 14px
    color: #FFF
    font-size: 12px
    margin-right: 6px
    padding: 4px 6px
</style>
