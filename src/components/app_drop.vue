<template>
  <div
    v-bind='$attrs'
    @drop.stop='onDrop'
    @dragenter.stop='onDragenter'
    @dragover.prevent
  >
    <slot/>
  </div>
</template>

<script>
// https://www.tutorialspoint.com/html5/html5_drag_drop.htm
// 1. dragstart
// 2. dragenter
// 3. dragover
// 4. dragleave
// 5. drag
// 6. drop
// 7. dragend

export default {
  props: {
    transferData: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDrop(e) {
      const transferData = JSON.parse(e.dataTransfer.getData('payload'));
      this.$emit('drop', transferData);
    },
    onDragenter() {
      this.$emit('dragenter', this.transferData);
    }
  }
}
</script>
