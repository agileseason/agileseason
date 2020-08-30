<template>
  <div>
    Loading...
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Oath',
  data: () => ({
    rememberToken: undefined,
  }),
  computed: {
    isSignedIn: get('user/isSignedIn')
  },
  async created() {
    this.rememberToken = this.$route.query.remember_token;
    // console.log(this.$route.query.remember_token);

    if (this.rememberToken != null && this.rememberToken != '') {
      console.log(this.rememberToken);
      // this.$router.push({ name: 'transactions' });
      const isSuccess = await this.login({ rememberToken: this.rememberToken });
      if (isSuccess) {
        console.log('success');
      } else {
        console.log('fail');
      }
    } else {
      console.log('general fail');
    }
  },
  methods: {
    ...call([
      'user/login'
    ])
  }
}
</script>
