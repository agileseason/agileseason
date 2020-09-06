<template>
  <div class='boards'>
    <h1>Boards</h1>

    <div v-if='isLoading'>
      Loading...
    </div>
    <div v-else>
      {{ token }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
  },
  data: () => ({
    boards: undefined,
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isLoading: get('user/isLoading'),
    token: get('user/token')
  },
  async created() {
    console.log('created');
    console.log(this.isSignedIn);
    if (this.isSignedIn) {
      const user = await this.fetchProfile(this.token);
      if (user == null) {
        // this.$router.push({ name: 'home' });
      }
    } else {
      // this.$router.push({ name: 'home' });
    }
  },
  methods: {
    ...call([
      'user/fetchProfile'
    ])
  }
}
</script>
