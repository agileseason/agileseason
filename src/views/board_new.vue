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

        <Button class='install' text='Install App' to='/' />
      </div>

      <div class='step disabled'>
        <div class='title'>2. Select Repositories</div>
      </div>

      <div class='step disabled'>
        <div class='title'>3. Import Issues</div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/buttons/button.vue'
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
    Button,
    TopMenu
  },
  data: () => ({}),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    token: get('user/token')
  },
  async created() {
    // TODO: Fetch installations
    const user = await this.fetchProfile(this.token);
    if (user == null) {
      this.$router.push({ name: 'home' });
    }
  },
  methods: {
    ...call([
      'user/fetchProfile'
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
</style>
