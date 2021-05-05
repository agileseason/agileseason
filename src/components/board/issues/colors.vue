<template>
  <div class='colors'>
    <label class='active' @click='toggleColors'>
      <span>Color</span>
      <ButtonIcon name='gear' style='float: right; padding: 0' />
    </label>
    <Select
      v-if='isSelectOpen'
      title='Set color'
      class='select-colors'
    >
      TODO
    </Select>
    <div v-if='isPlaceholderVisible' class='placeholder'>
      No color
    </div>
  </div>
  <div v-if='isSelectOpen' class='select-overlay' @click.self='toggleColors' />
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
  },
  data: () => ({
    isSelectOpen: false,
    selectedColor: null
  }),
  computed: {
    isPlaceholderVisible() {
      return this.selectedColor == null;
    }
  },
  watch: {
  },
  methods: {
    toggleColors() {
      this.isSelectOpen = !this.isSelectOpen;
    }
  }
}
</script>

<style scoped lang='sass'>
.colors
  position: relative

.select-colors
  position: absolute
  top: 20px
  width: 220px
  z-index: 2

.select-overlay
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
