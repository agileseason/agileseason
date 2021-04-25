<template>
  <div class='modal is-expanded'>
    <slot/>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  computed: {},
  methods: {}
}
</script>

<style lang='sass'>
.modal-overlay
  background: rgba(0, 0, 0, 0.3)
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 4

.modal
  background-color: #fff
  min-height: 500px
  position: absolute
  top: 36px
  left: 50%
  width: 80%
  max-width: 1280px
  z-index: 5
  box-shadow: 0px 6px 10px 0px #BDBDBD

  transform: translate(-50%, 2000px)

  &.slide-enter-to
    transform: translate(-50%, 0%)

  &.is-expanded:not(.slide-enter-active)
    transform: translateX(-50%)

.slide-enter-active,
.slide-leave-active
  transition: transform 200ms
</style>
