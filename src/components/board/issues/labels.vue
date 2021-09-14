<template>
  <div v-if='isSelectOpen' class='select-labels-overlay' @click.self='toggleLabels' />
  <div class='labels'>
    <label
      class='active'
      :class="{ 'is-readonly': isReadonly }"
      @click='toggleLabels'
    >
      <span>Labels</span>
      <ButtonIcon v-if='!isReadonly' name='gear' style='float: right; padding: 0' />
    </label>
    <Select
      v-if='isSelectOpen'
      title='Apply labels to this issue'
      class='select-labels'
    >
      <Loader v-if='isLoading' is-inline />
      <div class='body-labels' v-else>
        <div
          v-for='label in githubLabels'
          class='github-label'
          :key='label.id'
          @click='toggle(label)'
        >
          <span class='check' :class="{ checked: isApplied(label) }" />
          <span class='color' :style='colorStyles(label)' />
          <span class='name'>{{ label.name }}</span>
        </div>
      </div>
    </Select>
    <div v-if='isPlaceholderVisible' class='placeholder'>
      None yet
    </div>
    <div v-if='labels.length > 0' class='applied-labels'>
      <Label
        v-for='(label, $index) in labels'
        :label='label'
        :key='$index'
        class='label'
      />
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Label from '@/components/board/label'
import Loader from '@/components/loader';
import Select from '@/components/select';
import { call } from 'vuex-pathify';

export default {
  components: {
    ButtonIcon,
    Label,
    Loader,
    Select
  },
  props: {
    labels: { type: Array, required: true },
    repositoryFullName: { type: String, required: true },
    isReadonly: { type: Boolean, default: false }
  },
  emits: ['toggle'],
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
    isApplied({ name }) {
      return this.labels.findIndex(v => v.name === name) >= 0;
    },
    colorStyles({ color }) {
      return `background-color: #${color}`;
    },
    async toggleLabels() {
      if (this.isReadonly) { return; }

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
      this.$emit('toggle', label);
    }
  }
}
</script>

<style scoped lang='sass'>
.labels
  position: relative

  .label
    margin: 2px 4px 4px 0

.select-labels
  position: absolute
  top: 20px
  width: 220px
  z-index: 2

.body-labels
  overflow-y: scroll
  max-height: calc(100vh - 320px)

.github-label
  display: flex
  align-items: center
  padding: 8px
  cursor: pointer

  &:not(:last-child)
    border-bottom: 1px solid #c5cae9

  .check
    background-image: url('../../../assets/icons/issue/check.svg')
    background-position: center
    background-repeat: no-repeat
    height: 16px
    margin-right: 8px
    opacity: 0
    width: 16px

    &.checked
      opacity: 100

  .color
    height: 14px
    width: 14px
    border-radius: 7px
    margin-right: 8px

  .name
    font-size: 14px
    font-weight: 500

.select-labels-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

label
  align-items: center
  color: #283593
  display: flex
  font-weight: 500
  justify-content: space-between
  margin-bottom: 6px
  user-select: none

  &.active:not(.is-readonly)
    cursor: pointer

    &:hover
      opacity: 0.8

.placeholder
  color: #5c6bc0
  font-size: 12px
  font-weight: 100
</style>
