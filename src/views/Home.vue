<template>
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
  </div>

  <div class='container'>
    <article>
      <h3>Features</h3>

      <div class='features'>
        <div class='feature'>
          <h4>Protect your secrets</h4>
          <p>
            We won't be able to read or change your code, since we won't
            require any of these permissions from GitHub
          </p>
        </div>
        <div class='feature'>
          <h4>Many repositories in one view</h4>
          <p>Connect any number of GitHub repositories to a single board</p>
        </div>
        <div class='feature'>
          <h4>Connected to GitHub in real-time</h4>
          <p>
            Agile Season connects directly to your GitHub issues, so there's
            no duplicate work and you're not jumping back and forth between tools
          </p>
        </div>
        <div class='feature'>
          <h4>Customizable workflow</h4>
          <p>Add and remove columns to fit how your team works</p>
        </div>
      </div>
    </article>
  </div>
  <iframe
    src='https://agileseason.com/#/shared/board/4b4e403d6ea0a182f6994b8c67d2ec55'
    width='100%'
    height='800px'
    style='border: none'
  />
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
.container
  max-width: 1000px
  margin: 0 auto
  padding: 40px 0

.signin
  min-width: 130px
  margin: 30px 0

h1
  font-size: 40px
  margin: 0 0 10px

h2
  font-weight: 400
  margin: 0 0 10px

h3,
h4
  font-weight: 500

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

footer
  background-color: #37474f
  color: #cfd8dc
  min-height: 200px

  ul
    list-style: none
    margin: 0 0 28px 0
    padding: 0

  a
    color: #cfd8dc
</style>
