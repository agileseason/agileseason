<template>
  <div class='boards'>
    <TopMenu>
      <div class='title'>Boards</div>
    </TopMenu>
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
import TopMenu from '@/components/menu/top.vue'
import { get, call } from 'vuex-pathify';

export default {
  name: 'Boards',
  components: {
    TopMenu
  },
  data: () => ({
    // boards: undefined,
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isLoading: get('user/isLoading'),
    token: get('user/token')
  },
  async created() {
    // console.log('created');
    // console.log(this.isSignedIn);
    if (this.isSignedIn) {
      const user = await this.fetchProfile(this.token);
      if (user == null) {
        this.$router.push({ name: 'home' });
      }
    } else {
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
.title
  vertical-align: middle
  text-align: center
  font-weight: 400
  font-size: 16px
  line-height: 34px
  color: #FFFFFF
</style>
