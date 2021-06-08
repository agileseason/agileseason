<template>
  <div
    v-bind='$attrs'
    :draggable='!isReadOnly'
    @dragstart.self='onDrag'
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
  props: {
    transferData: {
      type: Object,
      required: true
    },
    isReadOnly: { type: Boolean, default: false }
  },
  methods: {
    onDrag (e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.setData('payload', JSON.stringify(this.transferData));
    }
  }
}
</script>
