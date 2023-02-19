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

import * as Sentry from '@sentry/browser';

const COLUMN_TOP_CLASSES = {
  'column-drag': true,
  'header': true,
  'issues-count': true,
  'name-wrapper': true,
  'name': true,
  'icons': true,
  'icon is-auto-assign': true,
  'icon is-auto-close': true,
  'issue-new': true,
  'column-settings': true
};

export default {
  props: {
    transferData: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDrop(e) {
      const payload = e.dataTransfer.getData('payload');
      if (payload == null || payload === '') return;

      try {
        const transferData = JSON.parse(payload);
        this.$emit( 'drop', {
          ...transferData,
          isColumnTop: !!COLUMN_TOP_CLASSES[e.toElement.className]
        });
      } catch (e) {
        Sentry.setContext('transferData', { payload });
        Sentry.captureException(e);
      }
    },
    onDragenter() {
      this.$emit('dragenter', this.transferData);
    }
  }
}
</script>
