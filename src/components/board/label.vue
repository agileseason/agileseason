<template>
  <span
    class='label'
    v-bind='$attrs'
    :class="{ 'bordered' : isBordered(label) }"
    :style='labelStyle(label)'
  >
    {{ label.name }}
  </span>
</template>

<script>
import { hex } from '@/utils/wcag_contrast';

// const DARK_TEXT = '000000';
// const LIGHT_TEXT = 'ffffff';
const DARK_TEXT = '212121';
const LIGHT_TEXT = 'fafafa';

export default {
  props: {
    label: { type: Object, required: true }
  },
  methods: {
    labelStyle({ color }) {
      const lightRatio = hex(`#${LIGHT_TEXT}`, `#${color}`)
      const fontColor = lightRatio < 3.0 ? DARK_TEXT : LIGHT_TEXT;
      return `background-color: #${color}; color: #${fontColor}; border-color: #${color}`;
    },
    isBordered({ color }) {
      return color === 'fff' || color === 'ffffff';
    }
  }
}
</script>

<style scoped lang='sass'>
.label
  border-radius: 10px
  box-sizing: border-box
  display: inline-block
  font-size: 11px
  font-weight: 500
  height: 19px
  letter-spacing: 0.2px
  line-height: 18px
  margin-right: 6px
  margin-top: 6px
  border: 1px solid
  padding: 0 9px

  &.bordered
    border-color: #e0e0e0 !important
</style>
