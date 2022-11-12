<template>

  <button @click="onClick">{{ label }}</button>

</template>

<script>

export default {
  name: 'TButton',
  props: {
    label: String
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

</style>