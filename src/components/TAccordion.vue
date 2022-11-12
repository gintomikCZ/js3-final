<template>
  <div class="accordion">
    <div class="header" @click="onHeaderClick">
      <slot name="header"></slot>
    </div>

    <transition name="accordion">
      <div v-if="show" class="content">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'TAccordion',
  props: {
    show: Boolean
  },
  methods: {
    onHeaderClick (e) {
      this.$emit('toggle-me', e)
    },
  },
}


</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.header
  cursor: pointer
  background: $bg-light
.content
  overflow: hidden

.accordion-enter-from, .accordion-leave-to
  max-height: 0
.accordion-enter-to, .accordion-leave-from
  max-height: 1000px

.accordion-leave-active, .accordion-enter-active
  transition: max-height .5s ease


</style>

