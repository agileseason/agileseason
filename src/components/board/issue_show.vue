<template>
  <div v-if='isNotFound' class='issue'>
    <div class='issue-header'>
      <div class='close' @click='close' />
    </div>
    <p class='not-found'>Couldn't found issue</p>
  </div>
  <div v-else class='issue'>
    <div class='issue-header'>
      <span v-if='state' class='state' :class='{"closed": isClosed}'>{{ state }}</span>
      <span class='repo'>{{ repositoryName }}</span>
      <ButtonIcon name='close' @click='close' style='float: right' />
    </div>
    <IssueBody>
      <div class='left'>
        <Title
          :title='title'
          :url='url'
          :number='number'
          @save='updateTitle'
        />
        <Loader v-if='isLoading' />
        <div v-if='isLoaded' class='main-comment comment'>
          <img class='avatar' :src='fetchedIssue.author.avatarUrl' />

          <div class='content'>
            <div class='header'>
              <div>
                <a class='author' :href='fetchedIssue.author.url'>{{ fetchedIssue.author.login }}</a>
                <span class='ago' :title='fetchedIssue.createdAt'>
                  commented {{ fetchedIssue.origCreatedAgo }}
                </span>
              </div>
              <ButtonIcon name='edit' @click='startEditBody' />
            </div>

            <div v-if='isBodyEmpty' class='text empty'>No description provided</div>
            <div v-else class='text'>
              {{ fetchedIssue.body }}
            </div>
          </div>
        </div>

        <Loader v-if='isCommentLoading' />
        <div v-if='isCommentLoaded' class='comments'>
          <div v-for='item in comments' :key='item.id' class='comment'>
            <img class='avatar' :src='item.author.avatarUrl' />

            <div class='content'>
              <div class='header'>
                <div>
                  <a class='author' :href='item.author.url'>{{ item.author.login }}</a>
                  <span class='ago' :title='item.createdAt'>
                    commented {{ item.createdAgo }}
                  </span>
                </div>
                <!--ButtonIcon name='edit' @click='startEditComment' /-->
              </div>

              <div class='text'>
                {{ item.body }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='right'>
        <Assigness />
      </div>
    </IssueBody>

    <!--div>
      {{ debugStore }}
    </div-->
  </div>
</template>

<script>
import Assigness from '@/components/board/issues/assigness.vue'
import ButtonIcon from '@/components/buttons/icon.vue'
import IssueBody from '@/components/board/issues/body_content.vue'
import Loader from '@/components/loader';
import Title from '@/components/board/issues/title';
import { get, call } from 'vuex-pathify';

export default {
  name: 'IssueShow',
  components: {
    Assigness,
    ButtonIcon,
    IssueBody,
    Loader,
    Title
  },
  props: {
    // See setCurrentIssue and currentIssue.
    issue: { type: Object, required: false },
  },
  data: () => ({
    newTitle: undefined,
    isSubmitting: false
  }),
  computed: {
    isLoading: get('issue/isLoading'),
    isLoaded: get('issue/isLoaded'),
    isCommentLoading: get('issue/isCommentLoading'),
    isCommentLoaded: get('issue/isCommentLoaded'),
    isNotFound: get('issue/isNotFound'),
    fetchedIssue: get('issue'),
    comments: get('issue/comments'),
    id() { return parseInt(this.$route.params.issueId); },
    number() { return parseInt(this.$route.params.issueNumber); },
    url() { return this.issue.url || this.fetchedIssue?.url; },
    repositoryName() { return this.issue.repositoryName || this?.fetchedIssue.repositoryName; },
    title() {
      if (this.newTitle) { return this.newTitle; }
      return this.isLoaded ? this.fetchedIssue.title : this.issue.title;
    },
    isClosed() {
      return this.isLoaded ? this.fetchedIssue.isClosed : this.issue.isClosed;
    },
    isBodyEmpty() { return this.fetchedIssue?.body == null || this.fetchedIssue?.body?.length == 0; },
    state() {
      if (this.isClosed == null) { return null; }
      return this.issue.isClosed ? 'closed' : 'open';
    },

    // debugStoreColumns: get('board/columns'),
    // debugStoreCurrentIssue: get('board/currentIssue'),

    // debugStore() {
    //   return { currentIssue: this.debugStoreCurrentIssue, board: this.debugStoreColumns };
    // },
  },
  async created() {
    if (this.id) {
      await this.fetch({ id: this.id });
      this.fetchComments({ id: this.id });
      // Возможно стоит перенести этот метод в
      // modules/issue fetch в commit FINISH_LOADING.
      this.updateBoardIssue({ ...this.fetchedIssue });
    }
  },
  methods: {
    ...call([
      'issue/fetch',
      'issue/fetchComments',
      'board/updateIssue',
      'board/updateBoardIssue'
    ]),
    close() { this.$emit('close'); },
    async updateTitle(newTitle) {
      if (this.isSubmitting) { return; }

      // Придумать как тобразить процесс сохранение заголовка.
      // Возможно стоит не закрывать форму редактирования, disable-ить
      // и добавлять isLoader к кнопке save.
      this.isSubmitting = true;
      this.newTitle = newTitle;
      await this.updateIssue({
        id: this.id,
        title: this.newTitle,
        columnId: this.fetchedIssue.columnId
      });

      this.isSubmitting = false;
    }
  }
}
</script>

<style scoped lang='sass'>
.not-found
  font-size: 24px
  font-weight: 500
  margin: 40px 0
  text-align: center
  width: 100%

.issue-header
  border-bottom: 1px solid #c5cae9
  box-sizing: border-box
  height: 44px
  padding: 10px 14px
  position: relative

  .state
    background-color: #22863a
    background-image: url('../../assets/icons/issue/white_open.svg')
    background-position-y: center
    background-position-x: 4px
    background-repeat: no-repeat
    border-radius: 12px
    box-sizing: border-box
    color: #fff
    display: inline-block
    font-size: 12px
    height: 24px
    line-height: 20px
    margin-right: 8px
    padding: 2px 8px 2px 24px
    vertical-align: top

    &.closed
      background-color: #d73a49
      background-image: url('../../assets/icons/issue/white_closed.svg')

  .repo
    font-weight: 500
    line-height: 22px

.comment
  position: relative
  margin-bottom: 20px

  .avatar
    width: 40px
    height: 40px
    border-radius: 20px
    background: #eee
    position: absolute
    left: 0
    top: 0

  .content
    border-radius: 4px
    border: 1px solid #e8eaf6
    margin-left: 50px
    padding: 10px

    .header
      display: flex
      justify-content: space-between
      align-items: flex-start
      margin-bottom: 2px
      min-height: 24px

      a.author
        display: inline-block
        color: #283593
        font-size: 13px
        font-weight: 500
        cursor: pointer

        &:hover
          text-decoration: underline

      .ago
        margin-left: 2px
        color: #283593
        font-size: 13px
        font-weight: 400

    .text
      font-family: Roboto
      font-size: 14px
      font-style: normal
      font-weight: 400
      line-height: 18px
      letter-spacing: 0.012em

      &.empty
        color: #9e9e9e
</style>
