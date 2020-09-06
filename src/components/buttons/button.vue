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
    :class='[type]'
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
  color: #fff
  display: inline-block
  font-size: 14px
  font-weight: bold
  height: 40px
  padding: 0 24px
  line-height: 38px
  position: relative
  text-align: center
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s
  text-decoration: none

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
