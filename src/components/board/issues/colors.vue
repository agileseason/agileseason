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
    v-if='color'
    :label='selectedColorName'
    class='selected-color'
  />
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Label from '@/components/board/label'
import Select from '@/components/select';

// https://kalinichev.net/palette.html
// color: 100, markerColor: a100, border: 400
const COLORS = [
  { name: 'Red', color: 'ffcdd2', markerColor: 'ff8a80', border: 'ef5350' },
  { name: 'Pink', color: 'f8bbd0', markerColor: 'ff80ab', border: 'ec407a' },
  { name: 'Purple', color: 'e1bee7', markerColor: 'ea80fc', border: 'ab47bc' },
  { name: 'Deep purple', color: 'd1c4e9', markerColor: 'b388ff', border: '7e57c2' },
  { name: 'Indigo', color: 'c5cae9', markerColor: '8c9eff', border: '5c6bc0' },
  { name: 'Blue', color: 'bbdefb', markerColor: '82b1ff', border: '42a5f5' },
  { name: 'Light Blue', color: 'b3e5fc', markerColor: '80d8ff', border: '29b6f6' },
  { name: 'Cyan', color: 'b2ebf2', markerColor: '84ffff', border: '26c6da' },
  { name: 'Teal', color: 'b2dfdb', markerColor: 'a7ffeb', border: '26a69a' },
  { name: 'Green', color: 'c8e6c9', markerColor: 'b9f6ca', border: '66bb6a' },
  { name: 'Light Green', color: 'dcedc8', markerColor: 'ccff90', border: '9ccc65' },
  { name: 'Lime', color: 'f0f4c3', markerColor: 'f4ff81', border: 'd4e157' },
  { name: 'Yellow', color: 'fff9c4', markerColor: 'ffff8d', border: 'ffee58' },
  { name: 'Amber', color: 'ffecb3', markerColor: 'ffe57f', border: 'ffca28' },
  { name: 'Orange', color: 'ffe0b2', markerColor: 'ffd180', border: 'ffa726' },
  { name: 'Deep Orange', color: 'ffccbc', markerColor: 'ff9e80', border: 'ff7043' },
  { name: 'Brown', color: 'd7ccc8', markerColor: 'a1887f', border: '8d6e63' },
  { name: 'Gray', color: 'f5f5f5', markerColor: 'bdbdbd', border: '9e9e9e' },
  { name: 'Blue Gray', color: 'cfd8dc', markerColor: '78909c', border: '607d8b' },
  { name: 'White', color: 'ffffff', markerColor: 'ffffff', border: 'e0e0e0' },
];

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
    isPlaceholderVisible() {
      return this.color == null;
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
    colorStyles({ markerColor, border }) {
      return `background-color: #${markerColor}; border-color: #${border}`;
    },
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
