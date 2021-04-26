<template>
  <router-link
    v-if='to'
    class='button'
    :class="[
      type,
      {
        'disabled': isDisabled || isLoading,
      }
    ]"
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
    :class="[type, { 'disabled': isDisabled || isLoading }]"
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
    :class="[type, { 'disabled': isDisabled || isLoading }]"
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
  name: 'AppButton',
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
  height: 40px
  letter-spacing: 0.3px
  line-height: 38px
  padding: 0 24px
  position: relative
  text-align: center
  text-decoration: none
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s
  min-width: 160px

  &.disabled
    cursor: default

  &.indigo
    background: #3F51B5
    border: 1px solid #3F51B5

    &:hover
      background: #303F9F
      border-color: #303F9F

    &:active
      background: #283593
      border-color: #283593

    &.disabled
      background-color: #9FA8DA
      border-color: #9FA8DA
      color: #F5F5F5

  &.outline
    color: #3F51B5
    border: 1px solid #3F51B5

    &:hover
      color: #303F9F
      border-color: #303F9F
      background-color: #E8EAF6

    &:active
      color: #283593
      border-color: #283593

  &.white
    padding: 0 12px
    background-color: #FFF
    border: 1px solid #FFF
    color: #283593
    height: 32px
    line-height: 30px

    &.disabled
      background-color: #EEE
      border: 1px solid #EEE

    &:hover
      background: #E8EAF6
      border-color: #E8EAF6

    &:active
      background: #C5CAE9
      border-color: #C5CAE9

  &.flat
    background: transparent
    border-color: transparent
    font-weight: 500
    height: 32px
    line-height: 30px

    &:hover
      color: #E8EAF6

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
