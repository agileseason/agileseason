<template>
  <div class='container'>
    <h1>Agile Season</h1>
    <h2>{{ subtitle }}</h2>
    <Loader v-if='isLoading' />

    <div v-if='isGoHomeNote'>
      <p>Please Sign in before using invitation link</p>
      <Button
        :href='/#/'
        text='Sign in'
      />
    </div>

    <div class='dev-notes'>
      Signed in: {{ isSignedIn }}
      <br />
      {{ token }}
    </div>
  </div>
</template>

<script>
// http://localhost:8080/#/i/670299745d0a0ee21f489f7f7df8c86d
import Button from '@/components/buttons/button.vue'
import Loader from '@/components/loader';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    Button,
    Loader
  },
  data: () => ({
    isLoading: true,
    boardName: undefined
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    token() { return this.$route.params.token; },
    subtitle() {
      if (this.isLoading) { return ''; }
      if (this.boardName == null) { return 'Invite is not found'; }

      return 'Invite';
    },
    isGoHomeNote() {
      return !this.isLoading && !this.isSignedIn;
    }
  },
  methods: {
    ...call([
      'user/login'
    ])
  }
}
</script>

<style scoped lang='sass'>
.container
  max-width: 1000px
  margin: 40px auto
  text-align: center
</style>
