<template>
  <TopMenu title='Boards' />

  <div v-if='isLoaded' class='boards'>
    <div
      v-for='board in boards'
      :key='board.id'
      class='board'
      @click='goto(board)'
    >
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

    <router-link class='board new' to='/boards/new'>New Board...</router-link>
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
  display: flex
  padding: 14px

  .board
    background-color: #FFFFFF
    border-radius: 4px
    box-sizing: border-box
    cursor: pointer
    display: flex
    flex-direction: column
    font-size: 16px
    height: 100px
    justify-content: space-between
    margin-right: 14px
    padding: 10px
    width: 200px

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

    .users
      max-height: 48px
      overflow: hidden
      text-align: right
</style>
