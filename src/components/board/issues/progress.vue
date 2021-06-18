<template>
  <div
    v-if='percentage'
    v-bind='$attrs'
    class='progress'
  >
    <div class='label'>
      {{ done }}/{{ total }} · {{ percentage }}%
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: { type: Number, default: null },
    done: { type: Number, default: null }
  },
  computed: {
    percentage() {
      if (this.total == null || this.done == null) { return null; }
      if (this.done == 0) { return 0; }

      return Math.round((this.done / this.total) * 100);
    }
  }
}
</script>

<style scoped lang='sass'>
.progress
  background-color: rgba(0, 0, 0, 0.08)
  height: 15px
  display: flex
  align-items: center
  justify-content: center

  .label
    color: #1a237e
    font-size: 10px
</style>
