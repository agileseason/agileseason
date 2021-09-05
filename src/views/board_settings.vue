<template>
  <TopMenu
    title='Settings'
    :breadCrumbs='breadCrumbs'
  />
  <Tabs
    v-if='!isLoading'
    :items='tabs'
    :active='active'
    @select='selectTab'
  />
  <div class='body'>
    <Loader v-if='isLoading' title='Settings' />
    <div v-if='isNotFound' class='not-found'>Not Found</div>
    <div v-if='active === "General" && isLoaded'>
      <article>
        <div class='title'>Board Name</div>
        <div class='board-container'>
          <Input
            class='board-name'
            :value='boardName'
            v-model='boardName'
          />
          <Button
            type='outline'
            size='small'
            text='Rename'
            class='button-board-rename'
            @click='renameBoard'
            :is-loading='isSubmittingName'
          />
        </div>
      </article>
      <article>
        <div class='title'>Share this board</div>
        <label class='checkbox'>
          <input
            type='checkbox'
            :checked='isBoardShared'
            @change='toggleIsSharedBoard'
            :disabled='isSubmitting'
          />
          Enable access by link (read only)
        </label>
        <a
          v-if='isBoardShared'
          class='public-link'
          :href='sharedUrl'
          target='_blank'
        >
          {{ sharedUrl }}
        </a>
      </article>
      <article>
        <div class='title'>Board issues</div>
        <label class='checkbox'>
          <input
            type='checkbox'
            :checked='isBoardIssueProgressVisible'
            @change='toggleIsIssueProgressVisibleBoard'
            :disabled='isSubmitting'
          />
          Show issue completion percentage by checkboxes in body
        </label>

        <p>
          Autoarchive closed issues &mdash;
          <select
            v-model='autoarchiveOption'
            class='auto-archive'
            @change='changeAutoarchiveOptionBoard'
          >
            <option
              v-for='option in autoarchiveOptions'
              :key='option.value'
              v-bind:value='option.value'
            >
              {{ option.text }}
            </option>
          </select>
        </p>
      </article>
      <article>
        <div class='title'>Delete this board</div>
        <div>Once you delete a board, there is no going back. Please be certain.</div>
        <Button
          class='delete-board'
          type='danger'
          :is-loading='isDeleteSubmitting'
          :is-disabled='isDeleteSubmitting'
          @click='deleteBoard'
        >
          Delete
        </Button>
      </article>
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
        <p class='note'>
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
              <th class='text-right'>Synced Issues</th>
            </thead>
            <tbody>
              <tr v-for='item in repositories' :key='item.id'>
                <td class='name'>
                  {{ item.fullName }}
                </td>
                <td class='text-right'>
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
      <article>
        <div class='title'>Current Members</div>
        <table class='memberships'>
          <thead>
            <th>Username</th>
            <th class='text-right'>Revoke</th>
          </thead>
          <tbody>
            <tr v-for='(membership, $index) in memberships' :key='$index'>
              <td class='w-33p'>
                <div class='membership'>
                  <img :src='membership.avatarUrl' />
                  <span class='login'>{{ membership.username }}</span>
                </div>
              </td>
              <td class='text-right'>
                <span
                  v-if='membership.isOwner'
                >
                  Owner
                </span>
                <a
                  v-else
                  class='destroy'
                  title='Revoke Access'
                  @click='deleteMembership(membership)'
                />
              </td>
            </tr>
          </tbody>
        </table>
      </article>
      <article>
        <div class='title'>Invites</div>
        <p v-if='invites.length === 0' class='note'>
          There are no invites yet
        </p>
        <table v-else class='invites'>
          <thead>
            <th>Username</th>
            <th>Link</th>
            <!--th>Status</th-->
            <th class='text-right'>Revoke</th>
          </thead>
          <tbody>
            <tr v-for='(invite, $index) in invites' :key='$index'>
              <td class='w-33p'>
                <div class='invite'>
                  <img :src='invite.avatarUrl' />
                  <span class='login'>{{ invite.username }}</span>
                </div>
              </td>
              <td>{{ inviteUrl(invite) }}</td>
              <!--td class='status'>pending</td-->
              <td class='text-right'>
                <a
                  class='revoke'
                  title='Revoke Invite'
                  @click='deleteInvite(invite)'
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <Autocomplete
            :fetchSuggestions='fetchSuggestions'
            :submit='submitNewInvite'
          />
        </div>
        <p class='note'>
          Make sure that the user has access to the added repositories.
          Otherwise, the user will have access to the issue in read-only mode.
        </p>
      </article>
    </div>
  </div>
</template>

<script>
import Autocomplete from '@/components/autocomplete';
import Button from '@/components/buttons/button';
import Input from '@/components/inputs/indigo';
import Loader from '@/components/loader';
import Repository from '@/components/repositories/item';
import Tabs from '@/components/tabs/tabs';
import TopMenu from '@/components/menu/top';
import api from '@/api';
import { get, call } from 'vuex-pathify';

const DOMAIN = {
  development: 'http://localhost:8080',
  production: 'https://agileseason.com'
}[process.env.NODE_ENV];

const APP_URL = {
  development: 'https://github.com/apps/agileseason-dev/installations/new',
  production: 'https://github.com/apps/agileseason/installations/new'
}[process.env.NODE_ENV];

export default {
  name: 'BoardSettings',
  components: {
    Autocomplete,
    Button,
    Input,
    Loader,
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
    autoarchiveOption: 90,
    autoarchiveOptions: [
      { text: 'never', value: 1000000 },
      { text: 'after 180 days', value: 180 },
      { text: 'after 90 days', value: 90 },
      { text: 'after 30 days', value: 30 },
      { text: 'after 7 days', value: 7 }
    ],
    boardName: '',
    isBoardShared: false,
    isBoardIssueProgressVisible: false,
    active: 'General',
    isSubmitting: false,
    isSubmittingName: false,
    isDeleteSubmitting: false
  }),
  computed: {
    isLoaded: get('boardSettings/isLoaded'),
    isLoading: get('boardSettings/isLoading'),
    isNotFound: get('boardSettings/isNotFound'),
    isSyncingIssues: get('boardSettings/isSyncingIssues'),
    token: get('user/token'),
    boards: get('user/boards'),
    isShared: get('boardSettings/isShared'),
    sharedToken: get('boardSettings/sharedToken'),
    isIssueProgressVisible: get('boardSettings/isIssueProgressVisible'),
    autoarchiveDaysLimit: get('boardSettings/autoarchiveDaysLimit'),
    memberships: get('boardSettings/memberships'),
    invites: get('boardSettings/invites'),
    repositories: get('boardSettings/repositories'),
    pendingRepositories: get('boardSettings/pendingRepositories'),
    installationItems: get('installations/items'),
    boardId() { return parseInt(this.$route.params.id) || 0; },
    breadCrumbs() {
      if (this.currentBoard == null) {
        return [
          { name: 'Boards', path: '/boards' }
        ];
      }

      return [
        { name: 'Boards', path: '/boards' },
        { name: this.currentBoard.name, path: `/boards/${this.boardId}` }
      ];
    },
    currentBoard() {
      return this.boards.find(v => v.id === this.boardId);
    },
    appUrl() { return APP_URL; },
    domain() { return DOMAIN; },
    sharedUrl() { return `${this.domain}/#/shared/board/${this.sharedToken}`; }
  },
  async created() {
    await this.fetch({ id: this.boardId });
    this.boardName = this.currentBoard.name;
    this.isBoardShared = this.isShared;
    this.isBoardIssueProgressVisible = this.isIssueProgressVisible;
    this.autoarchiveOption = this.autoarchiveDaysLimit;
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'boardSettings/fetch',
      'boardSettings/update',
      'boardSettings/save',
      'boardSettings/reset',
      'boardSettings/destroyBoard',
      'boardSettings/createInvite',
      'boardSettings/destroyInvite',
      'boardSettings/destroyMembership',
      'boardSettings/toggleIsShared',
      'boardSettings/toggleIsIssueProgressVisible',
      'boardSettings/updateAutoarchiveDaysLimit'
    ]),
    updateBoard: call('board/update'),
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
    async syncIssues() {
      const id = this.boardId;
      const { isValid, errors } = await this.save({ id });
      if (isValid) {
        // console.log('SUCCESS sync issues...');
        // console.log(id);
        this.reset();
        this.$router.push({ name: 'board_sync', params: { id } });
      } else {
        console.error('ERROR sync issues...');
        console.error(errors);
      }
    },
    async renameBoard() {
      if (this.isSubmittingName) { return; }
      if (this.boardName === this.currentBoard.name) { return; }

      this.isSubmittingName = true;
      this.$nextTick(async () => {
        await this.updateBoard({
          id: this.currentBoard.id,
          name: this.boardName
        });
        this.isSubmittingName = false;
      });
    },
    async deleteBoard() {
      if (this.isDeleteSubmitting) { return; }
      this.isDeleteSubmitting = true;

      this.$nextTick(async () => {
        if (confirm('Are you sure?')) {
          const errors = await this.destroyBoard({ id: this.currentBoard.id });
          if (errors.length === 0) {
            this.$router.push({ name: 'boards' });
          }
        }
        this.isDeleteSubmitting = false;
      });
    },
    async fetchSuggestions(search) {
      return await api.fetchUsers(search);
    },
    async submitNewInvite({ login, avatarUrl }) {
      return await this.createInvite({
        login,
        avatarUrl
      });
    },
    async deleteInvite({ id }) {
      if (confirm('Are you sure?')) {
        await this.destroyInvite({ id });
      }
    },
    inviteUrl({ token }) {
      return `${this.domain}/#/i/${token}`;
    },
    async deleteMembership({ id }) {
      if (confirm('Are you sure?')) {
        await this.destroyMembership({ id });
      }
    },
    async toggleIsSharedBoard() {
      this.isSubmitting = true;
      this.isBoardShared = !this.isBoardShared;
      this.$nextTick(async () => {
        await this.toggleIsShared({
          id: this.currentBoard.id,
          isShared: this.isBoardShared
        });
        this.isSubmitting = false;
      });
    },
    async toggleIsIssueProgressVisibleBoard() {
      this.isSubmitting = true;
      this.isBoardIssueProgressVisible = !this.isBoardIssueProgressVisible;
      this.$nextTick(async () => {
        await this.toggleIsIssueProgressVisible({
          id: this.currentBoard.id,
          isIssueProgressVisible: this.isBoardIssueProgressVisible
        });
        this.isSubmitting = false;
      });
    },
    async changeAutoarchiveOptionBoard() {
      await this.updateAutoarchiveDaysLimit({
        id: this.currentBoard.id,
        autoarchiveDaysLimit: this.autoarchiveOption
      });
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
    @media screen and (min-width: 480px)
      margin-right: 100px
    @media screen and (max-width: 480px)
      margin-bottom: 40px

  h2.subtitle
    font-size: 18px
    font-weight: 500
    margin-top: 0
    margin-bottom: 16px

  .all-repositories
    margin-bottom: 30px
    width: 320px

  .linked-repositories
    margin-bottom: 18px
    min-width: 320px

a
  color: #2196f3
  font-weight: 400

table
  border-spacing: 0
  width: 100%

  th
    color: #3f51b5
    text-align: left
    padding-bottom: 6px
    border-bottom: 1px solid #e0e0e0

    &.text-right
      text-align: right

  td
    border-bottom: 1px solid #e0e0e0
    color: #424242
    padding: 10px 0

    &.text-right
      min-width: 120px
      text-align: right

    &.w-33p
      @media screen and (min-width: 480px)
        width: 33%

p.note
  color: #616161
  font-size: 12px
  letter-spacing: 0.2px
  margin-bottom: 16px

article
  margin-bottom: 50px

  .title
    font-size: 18px
    font-weight: bold
    line-height: 21px
    margin-bottom: 16px

  .delete-board
    margin-top: 24px
    width: 150px

  label.checkbox
    display: flex
    align-items: center

    input
      margin: 0 6px 0 0

  select.auto-archive
    border: none
    color: #3f51b5
    cursor: pointer
    font-size: 14px
    margin-left: -2px
    padding: 1px 0

    &:hover
      background-color: #e8eaf6

.board-container
  display: flex

  .board-name
    width: 240px
    margin-right: 12px

  .button-board-rename
    min-width: 108px

.public-link
  display: inline-block
  margin-top: 8px

.invites,
.memberships
  margin-bottom: 32px

  .invite,
  .membership
    display: flex
    align-items: center

    img
      border-radius: 12px
      display: inline-block
      height: 24px
      margin-right: 6px
      width: 24px

    .login
      display: inline-block
      font-size: 14px

  .status
    color: #bdbdbd

  .revoke,
  .destroy
    background-image: url('../assets/icons/trash.svg')
    background-position: center
    background-repeat: no-repeat
    border-radius: 4px
    cursor: pointer
    display: inline-block
    height: 24px
    width: 24px

    &:hover
      background-color: #e8eaf6

    &:active
      background-color: #c5cae9
</style>
