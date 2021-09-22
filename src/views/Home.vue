<template>
  <div class='hero'>
    <div class='container'>
      <h1>Agile Season</h1>
      <h2>Kanban board for GitHub issues</h2>
      <Button v-if='isSignedIn' class='signin' to='/boards' text='Go to App' />
      <Button v-else
        :isLoading='isLoading'
        :href='signInUrl'
        @click='startSignIn'
        class='signin'
        text='Sign in with GitHub'
      />
      <div class='logo' />
    </div>
  </div>

  <div class='container'>
    <article>
      <div class='features'>
        <div class='feature'>
          <h3>Protect your secrets</h3>
          <p>
            We won't be able to read or change your code, since we won't
            require any of these permissions from GitHub.
          </p>
        </div>
        <div class='feature'>
          <h3>Many repositories in one view</h3>
          <p>Connect any number of GitHub repositories to a single board.</p>
        </div>
        <div class='feature'>
          <h3>Connected to GitHub in real-time</h3>
          <p>
            Agile Season connects directly to your GitHub issues, so there's
            no duplicate work and you're not jumping back and forth between tools.
          </p>
        </div>
        <div class='feature'>
          <h3>Customizable workflow</h3>
          <p>Add and remove columns to fit how your team works. Use colors to highlight cards.</p>
        </div>
        <div class='feature'>
          <h3>Shared boards</h3>
          <p>You can share your board (read-only) with your clients or your community.</p>
        </div>
      </div>
      <p class='shared-board-example'>
        Our board &mdash;&nbsp;
        <a href='https://agileseason.com/#/shared/board/4b4e403d6ea0a182f6994b8c67d2ec55'>https://agileseason.com/#/shared/board/4b4e403d6ea0a182f6994b8c67d2ec55</a>
      </p>
      <iframe
        src='https://agileseason.com/#/shared/board/4b4e403d6ea0a182f6994b8c67d2ec55?fullScreen=true'
        width='100%'
        height='800px'
        style='border: none; margin: 0 -6px;'
      />
    </article>
  </div>
  <!--div class='dark'>
    <div class='container onething author'>
      <div class='img'/>
      <article class='large'>
        One in the field is not a warrior, but a traveler...
      </article>
    </div>
  </div-->
  <footer>
    <div class='container'>
      <h2>Resources</h2>
      <ul>
        <li>
          <a href='https://github.com/agileseason/agileseason'>
            github.com/agileseason
          </a>
        </li>
      </ul>
      <h2>Support</h2>
      <ul>
        <li>
          <a href='mailto:alex@agileseason.com'>alex@agileseason.com</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import Button from '@/components/buttons/button.vue'
import { get } from 'vuex-pathify';

export default {
  name: 'Home',
  components: {
    Button
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    signInUrl() {
      const DOMAIN_API = {
        development: 'http://localhost:3000',
        production: 'https://api.agileseason.com'
      }[process.env.NODE_ENV];
      return `${DOMAIN_API}/oauth`;
    }
  },
  methods: {
    startSignIn() {
      this.isLoading = true;
    }
  }
  // mounted() {
  //   console.log(process.env.VUE_APP_GITHUB_CLIENT_ID)
  //   console.log(process.env.VUE_APP_GITHUB_CLIENT_SECRET)
  // }
}

</script>

<style scoped lang='sass'>
.hero
  background-color: #fff

  .container
    padding: 80px 10px
    position: relative

    .logo
      background-image: url('../assets/logo.svg')
      background-repeat: no-repeat
      background-size: contain
      height: 367px
      position: absolute
      width: 200px
      right: 0
      top: 20px

  .signin
    min-width: 130px
    margin-top: 50px

.container
  margin: 0 auto
  padding: 40px 10px

  @media screen and (min-width: 1023px)
    max-width: 1200px
  @media screen and (max-width: 1023px)
    max-width: 1000px

h1
  font-size: 42px
  margin: 0 0 10px

h2
  font-size: 22px
  font-weight: 400
  margin: 0 0 10px

h3,
h4
  font-weight: 500

p
  font-size: 16px

  &.shared-board-example
    overflow: hidden

.feature
  &:not(:last-child)
    margin-bottom: 40px

.large
  font-size: 28px

.dark
  background-color: #263238
  color: #fff
  position: relative
  overflow: hidden

.onething
  padding: 120px 0

.img
  background-position: right
  background-repeat: no-repeat
  background: url('https://avatars.githubusercontent.com/u/2400100?v=4')
  background-size: cover
  height: 500px
  width: 500px
  position: absolute
  right: -50px
  top: -200px
  border-radius: 0 0 0 300px
  opacity: 0.2

article
  a, a:visited
    color: #2196f3

footer
  background-color: #37474f
  color: #cfd8dc
  min-height: 200px

  ul
    list-style: none
    margin: 0 0 28px 0
    padding: 0

  a, a:visited
    color: #cfd8dc

</style>
