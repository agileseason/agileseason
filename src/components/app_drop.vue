<template>
  <div
    v-bind='$attrs'
    @drop.stop='onDrop'
    @dragover.prevent
    @dragenter.prevent
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
  methods: {
    onDrop (e) {
      const transferData = JSON.parse(e.dataTransfer.getData('payload'))
      this.$emit('drop', transferData)
    }
  }
}
</script>
