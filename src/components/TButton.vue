<template>

  <button
    :class="{'btn-secondary': secondary}"
    @click="onClick"
    :type="btnType"
    >{{ label }}</button>

</template>

<script>

export default {
  name: 'TButton',
  props: {
    label: String,
    secondary: {
      type: Boolean,
      default: false
    },
    btnType: {
      type: String,
      default: 'submit'
    }
  },
  methods: {
    onClick () {
      this.$emit('clicked')
    }
  }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

button
  background: $bg-light
  border: 1px solid $border
  border-radius: $border-radius
  transition: background-color .3 ease
  padding: .4em .7em
  font-size: 1rem
  font-weight: bold
  &:hover
    background: $bg-hover
  &.btn-secondary
    background: $bg-secondary
    &:hover
      background: lighten($bg-secondary, 20)

</style>