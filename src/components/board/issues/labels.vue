<template>
  <div v-if='isSelectOpen' class='select-labels-overlay' @click.self='toggleLabels' />
  <div class='labels'>
    <label class='label active' @click='toggleLabels'>
      <span>Labels</span>
      <ButtonIcon name='gear' style='float: right; padding: 0' />
    </label>
    <Select
      v-if='isSelectOpen'
      title='Apply labels to this issue'
      class='select-labels'
    >
      <Loader v-if='isLoading' is-inline />
      <div v-else>
        <div
          v-for='label in githubLabels'
          class='github-label'
          :key='label.id'
          @click='toggle(label)'
        >
          <!--span class='check' :class="{ checked: isAssigned(user) }" />
          <img class='avatar' :src='user.avatarUrl' />
          <span class='login'>{{ user.login }}</span-->
          {{ label.name }}
        </div>
      </div>
    </Select>
    <div v-if='isPlaceholderVisible' class='placeholder'>
      None yet
    </div>
    <div
      v-for='(label, $index) in labels'
      :key='$index'
      class='label'
    >
      {{ label.name }}
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Loader from '@/components/loader';
import Select from '@/components/select';
import { call } from 'vuex-pathify';

export default {
  components: {
    ButtonIcon,
    Loader,
    Select
  },
  props: {
    labels: { type: Array, required: true },
    repositoryFullName: { type: String, required: true }
  },
  emits: ['toggleLabel'],
  data: () => ({
    isSelectOpen: false,
    isLoading: true,
    isLoaded: false,
    githubLabels: []
  }),
  computed: {
    isPlaceholderVisible() {
      return this.labels.length === 0;
    }
  },
  watch: {
    repositoryFullName(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      this.githubLabels = [];
      this.isLoading = true;
      this.isLoaded = false;
    }
  },
  methods: {
    ...call([
      'board/fetchLabels',
    ]),
    async toggleLabels() {
      this.isSelectOpen = !this.isSelectOpen;
      if (this.isSelectOpen && !this.isLoaded) {
        this.isLoading = true;
        const fetchLabels = await this.fetchLabels({
          repositoryFullName: this.repositoryFullName
        });
        this.githubLabels = [...fetchLabels];
        this.isLoading = false;
        this.isLoaded = true;
      }
    },
    toggle(label) {
      console.log('label: ' + label);
    }
  }
}
</script>

<style scoped lang='sass'>
.labels
  position: relative

.select-labels
  position: absolute
  top: 20px
  width: 220px
  z-index: 2

.select-labels-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

label.label
  align-items: center
  color: #283593
  display: flex
  font-weight: 700
  justify-content: space-between
  margin-bottom: 6px
  user-select: none

  &.active
    cursor: pointer

    &:hover
      opacity: 0.8

.placeholder
  color: #5c6bc0
  font-size: 12px
  font-weight: 100
</style>
