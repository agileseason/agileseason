<template>
  <div class='labels'>
    <label class='label active' @click='toggleLabels'>
      <span>Labels</span>
      <ButtonIcon name='gear' style='float: right; padding: 0' />
    </label>
    <Select
      v-if='isSelectOpen'
      title='Apply labels to this issue'
    >
      TODO
    </Select>
    <div v-if='isPlaceholderVisible' class='placeholder'>
      None yet
    </div>
  </div>
  <div v-if='isSelectOpen' class='select-labels-overlay' @click.self='toggleLabels' />
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Select from '@/components/select';

export default {
  components: {
    ButtonIcon,
    Select
  },
  props: {
    labels: { type: Array, required: true },
  },
  data: () => ({
    isSelectOpen: false,
    isLoading: true,
    selectedLabels: []
  }),
  computed: {
    isPlaceholderVisible() {
      return this.selectedLabels.length === 0;
    }
  },
  watch: {
  },
  methods: {
    toggleLabels() {
      this.isSelectOpen = !this.isSelectOpen;
    }
  }
}
</script>

<style scoped lang='sass'>
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
