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
      return `${process.env.VUE_APP_API_URL}/oauth`;
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
  margin: 40px auto

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
</style>
