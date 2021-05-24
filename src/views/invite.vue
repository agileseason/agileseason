<template>
  <div>
    <div>
      Signed in: {{ isSignedIn }}
    </div>
    {{ token }}
  </div>
</template>

<script>
// http://localhost:8080/#/i/670299745d0a0ee21f489f7f7df8c86d
import { get, call } from 'vuex-pathify';

export default {
  data: () => ({}),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    token() { return this.$route.params.token; }
  },
  methods: {
    ...call([
      'user/login'
    ])
  }
}
</script>
