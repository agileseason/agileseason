<template>
  <div class='modal is-expanded' v-bind='$attrs'>
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
  z-index: 3

.modal-overlay-blank
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1 // z-index: 2 on board/issue

.modal
  background-color: #fff
  border-radius: 0px 0px 10px 10px
  box-shadow: 0px 6px 10px 0px #bdbdbd
  left: 50%
  max-width: 1280px
  min-height: 500px
  position: absolute
  top: 36px
  width: 80%
  z-index: 4

  transform: translate(-50%, 2000px)

  &.slide-enter-to
    transform: translate(-50%, 0%)

  &.is-expanded:not(.slide-enter-active)
    transform: translateX(-50%)

  &.right-side
    left: auto
    min-height: auto
    right: 0
    top: 0
    transform: translateX(100%)
    width: 50%

    &.slide-enter-to
      transform: translateX(0%)

    &.is-expanded:not(.slide-enter-active)
      transform: none

.slide-enter-active,
.slide-leave-active
  transition: transform 140ms
</style>
