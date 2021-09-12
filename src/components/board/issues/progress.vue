<template>
  <div
    v-if='isVisible'
    v-bind='$attrs'
    class='progress'
  >
    <div class='bar' :style='barStyle' />
    <div class='label'>
      {{ done }}/{{ total }} · {{ percentage }}%
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: { type: Number, default: 0 },
    done: { type: Number, default: 0 }
  },
  computed: {
    isVisible() { return this.total > 0; },
    percentage() {
      if (this.done === 0) { return 0; }

      return Math.round((this.done / this.total) * 100);
    },
    barStyle() {
      return `width: ${this.percentage}%`;
    }
  }
}
</script>

<style scoped lang='sass'>
.progress
  background-color: rgba(0, 0, 0, 0.06)
  // background-color: rgba(121, 134, 203, 0.08)
  height: 15px
  display: flex
  align-items: center
  justify-content: center
  position: relative

  .bar
    // background-color: rgba(121, 134, 203, 0.5)
    // background-color: rgba(0, 0, 0, 0.1)
    // background-color: rgba(29, 233, 182, 0.8)
    // background-color: rgba(105, 240, 174, 0.9)
    background-color: rgba(0, 200, 83, 0.8)
    position: absolute
    left: 0
    top: 0
    height: 15px
    z-index: 1

  .label
    // color: #1a237e
    color: rgba(0, 0, 0, 0.8)
    font-size: 10px
    z-index: 2
</style>
