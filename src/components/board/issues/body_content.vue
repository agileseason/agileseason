<template>
  <div class='issue-body'>
    <slot />
  </div>
</template>

<style scoped lang='sass'>
.issue-body
  display: grid
  grid-template-columns: 1fr 220px
  grid-template-rows: 1fr
  gap: 0px 30px
  grid-template-areas: '. .'
  padding-bottom: 40px
</style>
