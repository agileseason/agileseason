<template>
  <div class='colors'>
    <label
      class='active'
      :class="{ 'is-readonly': isReadonly }"
      @click='toggleColors'
    >
      <span>Color</span>
      <ButtonIcon v-if='!isReadonly' name='gear' style='float: right; padding: 0' />
    </label>
    <Select
      v-if='isSelectOpen'
      title='Set color'
      class='select-colors'
    >
      <div class='body-colors'>
        <div
          v-for='(availableColor, $index) in availableColors'
          :key='$index'
          class='available-color'
          @click='toggle(availableColor)'
        >
          <span class='check' :class="{ checked: isApplied(availableColor) }" />
          <span class='color' :style='colorStyles(availableColor)' />
          <span class='name'>{{ availableColor.name }}</span>
        </div>
      </div>
    </Select>
    <div v-if='isPlaceholderVisible' class='placeholder'>
      No color
    </div>
  </div>
  <div v-if='isSelectOpen' class='select-overlay' @click.self='toggleColors' />
  <Label
    v-if='isColor'
    :label='selectedColorName'
    class='selected-color'
  />
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Label from '@/components/board/label'
import Select from '@/components/select';
import { COLORS, DEFAULT_COLOR, colorStyles } from '@/utils/colors';

export default {
  components: {
    ButtonIcon,
    Label,
    Select
  },
  props: {
    color: { type: String, required: false, default: null },
    isReadonly: { type: Boolean, default: false }
  },
  emits: ['toggle'],
  data: () => ({
    isSelectOpen: false,
    availableColors: COLORS
  }),
  computed: {
    isColor() {
      return this.color != null && this.color !== DEFAULT_COLOR;
    },
    isPlaceholderVisible() {
      return this.color == null || this.color === DEFAULT_COLOR;
    },
    selectedColorName() {
      const selectedAvailableColor = this.availableColors.find(v => v.color === this.color);
      if (selectedAvailableColor == null) { return { name: this.color, color: this.color }; }

      return { name: selectedAvailableColor.name, color: selectedAvailableColor.markerColor };
    }
  },
  watch: {
  },
  methods: {
    toggleColors() {
      if (this.isReadonly) { return; }
      this.isSelectOpen = !this.isSelectOpen;
    },
    isApplied({ color }) {
      return color === this.color;
    },
    colorStyles(color) { return colorStyles(color); },
    toggle({ color }) {
      this.$emit('toggle', color);
      this.toggleColors();
    }
  }
}
</script>

<style scoped lang='sass'>
.colors
  position: relative

.select-colors
  position: absolute
  top: 28px
  width: 220px
  z-index: 2

.selected-color
  margin: 2px 4px 4px 0

.select-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

.body-colors
  overflow-y: scroll
  max-height: calc(100vh - 300px)

label
  align-items: center
  color: #283593
  display: flex
  font-weight: 500
  justify-content: space-between
  padding: 6px 0
  user-select: none

  &.active:not(.is-readonly)
    cursor: pointer

    &:hover
      opacity: 0.8

.placeholder
  color: #5c6bc0
  font-size: 12px
  font-weight: 100

.available-color
  display: flex
  align-items: center
  padding: 8px
  cursor: pointer

  &:hover
    background-color: rgba(197, 202, 233, 0.8) // #c5cae9

  &:active
    background-color: rgba(197, 202, 233, 0.6) // #c5cae9

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
    border: 1px solid
    box-sizing: border-box

  .name
    font-size: 14px
    font-weight: 500
</style>
