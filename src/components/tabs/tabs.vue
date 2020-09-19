<template>
  <div class='tabs'>
    <div
      v-for='item in items'
      class='tab'
      :class="{ 'active': active === item }"
      :key='item.name'
      @click='select(item)'
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  components: {},
  props: {
    active: { type: String, required: true },
    items: { type: Array, required: true }
  },
  data: () => ({}),
  computed: {},
  methods: {
    select(item) {
      this.$emit('select', item);
    }
  }
}
</script>

<style scoped lang='sass'>
.tabs
  margin-top: 30px

  .tab
    color: #3F51B5
    cursor: pointer
    display: inline-block
    font-size: 16px
    padding: 0 14px 12px 14px

    &:hover
      border-bottom: 3px solid #9FA8DA

    &.active
      border-bottom: 3px solid #3F51B5
      color: #212121
      cursor: default
</style>
