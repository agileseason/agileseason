<template>
  <div class='container'>
    <h1>Agile Season</h1>
    <h2>{{ subtitle }}</h2>
    <h3 v-if='username'>@{{ username }}</h3>
    <Loader v-if='isLoading' />

    <div v-if='isGoHomeNote'>
      <p>Please Sign in before using invitation link</p>
      <Button
        href='/'
        text='Go Home to Sign in'
      />
    </div>

    <Button
      v-if='isValid'
      @click='accept'
      :is-loading='isSubmitting'
      text='Accept'
    />
  </div>
</template>

<script>
// http://localhost:8080/#/i/670299745d0a0ee21f489f7f7df8c86d
import Button from '@/components/buttons/button.vue'
import Loader from '@/components/loader';
import api from '@/api';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    Button,
    Loader
  },
  data: () => ({
    isLoading: true,
    inviteUsername: undefined,
    inviteBoardName: undefined,
    isSubmitting: false
  }),
  computed: {
    username: get('user/username'),
    isSignedIn: get('user/isSignedIn'),
    token() { return this.$route.params.token; },
    subtitle() {
      if (this.isLoading) { return ''; }
      if (this.inviteBoardName == null || this.username != this.inviteUsername) {
        return 'Invite is not found';
      }

      return `Invite to "${this.inviteBoardName}" board`;
    },
    isGoHomeNote() {
      return !this.isLoading && !this.isSignedIn && this.inviteBoardName != null;
    },
    isValid() {
      // console.log(this.inviteUsername);
      // console.log(this.username);
      return !this.isLoading && this.isSignedIn && this.inviteUsername === this.username;
    }
  },
  async created() {
    await this.fetchProfileLazy();
    const invite = await api.fetchInvite({ token: this.token });
    if (invite) {
      this.inviteUsername = invite.username;
      this.inviteBoardName = invite.boardName;
    }
    this.isLoading = false;
  },
  methods: {
    ...call([
      'user/fetchProfileLazy',
      'user/login'
    ]),
    accept() {
      this.isSubmitting = true;
      console.log('accept');
    }
  }
}
</script>

<style scoped lang='sass'>
.container
  max-width: 1000px
  margin: 40px auto
  text-align: center
</style>
