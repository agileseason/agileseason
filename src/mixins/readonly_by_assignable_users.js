import { get } from 'vuex-pathify';

export default {
  computed: {
    username: get('user/username'),
    isReadonly() {
      if (this.assignableUsers == null) { return true; }
      if (this.assignableUsers.length === 0) { return false; }

      const currentUser = this.assignableUsers.find(v => v.login === this.username);
      if (currentUser == null) { return true; }
      return false;
    }
  }
}
