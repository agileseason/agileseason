<template>
  <router-link
    v-if='to'
    class='button'
    :class="[type, size, { 'disabled': isDisabled || isLoading }]"
    :disabled='isDisabled || isLoading'
    tag='button'
    :to='to'
  >
    <span v-if='isLoading' class='loader' />
    <span v-else>
      {{ text }}
      <slot />
    </span>
  </router-link>
  <a
    v-else-if='href'
    class='button'
    :class="[type, size, { 'disabled': isDisabled || isLoading }]"
    :href='href'
    @click='click'
  >
    <span v-if='isLoading' class='loader' />
    <span v-else>
      {{ text }}
      <slot />
    </span>
  </a>
  <button
    v-else
    class='button'
    :class="[type, size, { 'disabled': isDisabled || isLoading }]"
    :disabled='isDisabled || isLoading'
    @click='click'
  >
    <span v-if='isLoading' class='loader' />
    <span v-else>
      {{ text }}
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'indigo',
      validator: (value) => (
        [
          'indigo',
          'flat',
          'outline',
          'white'
        ].indexOf(value) !== -1
      )
    },
    size: {
      type: String,
      required: false,
      default: 'normal',
      validator: (value) => (
        [
          'normal',
          'small'
        ].indexOf(value) !== -1
      )
    },
    text: { type: String, required: false, default: null },
    to: { type: [String, Object], required: false, default: null },
    href: { type: String, required: false, default: null },
    isDisabled: { type: Boolean, required: false, default: false },
    isLoading: { type: Boolean, required: false, default: false }
  },
  methods: {
    click() {
      if (this.isLoading || this.isDisabled) { return; }

      this.$emit('click');
    }
  }
};
</script>

<style scoped lang='sass'>
.button
  -webkit-tap-highlight-color: transparent
  border-radius: 4px
  box-sizing: border-box
  color: #fff
  cursor: pointer
  display: inline-block
  font-size: 14px
  font-weight: 500
  letter-spacing: 0.3px
  padding: 0 24px
  position: relative
  text-align: center
  text-decoration: none
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s

  &.normal
    height: 40px
    line-height: 38px
    min-width: 100px

  &.small
    // do nothing

  &.disabled
    cursor: default

  &.indigo
    background: #3f51b5
    border: 1px solid #3f51b5

    &:hover
      background: #303f9f
      border-color: #303f9f

    &:active
      background: #283593
      border-color: #283593

    &.disabled
      background-color: #9fa8da
      border-color: #9fa8da
      color: #f5f5f5

  &.outline
    color: #3f51b5
    border: 1px solid #3f51b5
    background-color: inherit

    &:hover
      color: #303f9f
      border-color: #303f9f
      background-color: #e8eaf6

    &:active
      color: #283593
      border-color: #283593

  &.white
    padding: 0 12px
    background-color: #fff
    border: 1px solid #fff
    color: #283593

    &.normal
      height: 32px
      line-height: 30px

    &.disabled
      background-color: #eee
      border: 1px solid #eee

    &:hover
      background: #e8eaf6
      border-color: #e8eaf6

    &:active
      background: #c5cae9
      border-color: #c5cae9

  &.flat
    background: transparent
    border-color: transparent
    font-weight: 500

    &.normal
      height: 32px
      line-height: 30px

    &:hover
      color: #e8eaf6

.loader
  background-image: url('../../assets/button/loader.svg')
  background-repeat: no-repeat
  background-size: contain
  height: 38px
  left: 50%
  position: absolute
  top: 50%
  transform: translateY(-50%) translateX(-50%)
  width: 38px
</style>
