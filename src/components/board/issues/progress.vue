<template>
  <div v-if='percentage' class='progress'>
    {{ percentage }}
  </div>
</template>

<script>
export default {
  props: {
    percentage: { type: [Number, String], default: null },
  }
}
</script>

<style scoped lang='sass'>
</style>
