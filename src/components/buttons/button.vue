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
  >
    <!--@click.prevent='click'-->
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
    @click.prevent='click'
  >
    <span v-if='isLoading' class='loader' :class='type' />
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
          'outline-white',
          'white',
          'danger'
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
          'medium',
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
    click(e) {
      if (this.isLoading || this.isDisabled) { return; }

      this.$emit('click', e);
    }
  }
};
</script>

<style scoped lang='sass'>
.button
  -webkit-tap-highlight-color: transparent
  border-radius: 4px
  box-sizing: border-box
  color: #fff !important
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
  white-space: nowrap

  &.normal
    height: 40px
    line-height: 38px

  &.medium
    height: 24px
    font-size: 12px

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
      color: #f5f5f5 !important

  &.outline
    color: #3f51b5 !important
    border: 1px solid #3f51b5
    background-color: inherit

    &.disabled
      border: 1px solid #bdbdbd
      color: #9e9e9e !important

    &:hover:not(.disabled)
      background-color: #e8eaf6

    &:active
      color: #283593 !important
      border-color: #283593

  &.outline-white
    background-color: inherit
    border: 1px solid #fff
    color: #fff !important

    &.disabled
      background-color: inherit
      border: 1px solid #9e9e9e
      color: #9e9e9e !important

    &:hover:not(.disabled)
      background-color: #3f51b5
      border-color: #e0e0e0
      color: #fff !important

    &:active
      border-color: #f5f5f5
      color: #f5f5f5 !important

  &.white
    padding: 0 12px
    background-color: #fff
    border: 1px solid #fff
    color: #283593 !important

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
    outline: none
    box-sizing: border-box
    border: 1px solid transparent

    &.normal
      height: 32px
      line-height: 30px

    &:hover
      color: #e8eaf6 !important

    &:focus
      border: 1px solid #fff

  &.danger
    background-color: inherit
    border: 1px solid #d50000
    color: #d50000 !important
    font-weight: 600

    &:hover
      background-color: #ffebee
      border-color: #b71c1c
      color: #b71c1c !important

    &:active
      border-color: #ff5252
      color: #ff5252 !important

.loader
  background-image: url('../../assets/button/white_loader.svg')
  background-repeat: no-repeat
  background-size: contain
  height: 38px
  left: 50%
  position: absolute
  top: 50%
  transform: translateY(-50%) translateX(-50%)
  width: 38px

  &.outline,
  &.white
    background-image: url('../../assets/button/indigo_loader.svg')
  &.danger
    background-image: url('../../assets/button/red_loader.svg')
</style>
