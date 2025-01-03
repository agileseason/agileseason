<template>
  <TopMenu title='Boards' />

  <div v-if='isLoaded' class='boards'>
    <div
      v-for='board in boards'
      :key='board.id'
      class='board-wrapper'
      @click='goto(board)'
    >
      <div class='board'>
        <div class='name'>
          {{ board.name }}
        </div>
        <div class='users'>
          <Avatar
            v-for='(user, $index) in board.users'
            v-bind='user'
            :key='$index'
          />
        </div>
      </div>
    </div>

    <div class='board-wrapper'>
      <router-link class='board new' to='/boards/new'>New Board...</router-link>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/avatar';
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
    Avatar,
    TopMenu
  },
  data: () => ({}),
  computed: {
    isLoaded: get('user/isLoaded'),
    token: get('user/token'),
    boards: get('user/boards')
  },
  async created() {
    const user = await this.fetchProfile();
    if (user == null) {
      this.$router.push({ name: 'home' });
    } else if (user.boards.length === 0) {
      this.$router.push({ name: 'board_new' });
    }
  },
  methods: {
    ...call([
      'user/fetchProfile'
    ]),
    goto({ id }) {
      this.$router.push({ name: 'board', params: { id } });
    }
  }
}
</script>

<style scoped lang='sass'>
.boards
  padding: 14px

  @media screen and (max-width: 660px)
    display: grid
    gap: 14px

  .board-wrapper
    display: inline-block
    width: 260px
    margin-right: 14px
    margin-bottom: 14px

    @media screen and (max-width: 660px)
      margin: 0
      width: 100%

  .board
    background-color: #FFFFFF
    display: flex
    border-radius: 4px
    box-sizing: border-box
    cursor: pointer
    flex-direction: column
    font-size: 16px
    height: 100px
    justify-content: space-between
    padding: 10px
    vertical-align: top

    &.new
      background-color: transparent
      border: 1px solid #C5CAE9
      color: #7986CB
      font-weight: 300

      &:hover
        color: #3F51B5
        border-color: #7986CB
        background-color: transparent

      &:active
        color: #5C6BC0
        border-color: #9FA8DA
        background-color: transparent

    &:hover
      background-color: rgba(255,255,255,0.6)

    &:active
      background-color: rgba(255,255,255,0.4)

    .name
      font-weight: 500
      overflow: hidden

    .users
      max-height: 48px
      min-height: 24px
      overflow: hidden
      text-align: right
</style>
