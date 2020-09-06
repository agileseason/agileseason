<template>
  <div class='container'>
    <h1>Agile Season</h1>
    <h2>Kanban board for GitHub issues</h2>
    <Button v-if='isSignedIn' class='signin' to='/boards' text='Go to App' />
    <Button v-else :href='signInUrl' class='signin' text='Sign in with GitHub' />
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
  data() {
    return {};
  },
  computed: {
    isSignedIn: get('user/isSignedIn'),
    signInUrl() {
      return `${process.env.VUE_APP_API_URL}/oauth`;
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
  min-width: 90px
  margin-top: 30px

h1
  font-size: 40px
  margin: 0 0 10px

h2
  font-weight: 400
  margin: 0 0 10px
</style>
