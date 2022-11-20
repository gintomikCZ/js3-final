<template>
  <transition name="modal-layout">
    <div class="layout" v-if="showLayout" @transitionend="onTransitionEnd" @click.self="$emit('close-me')">
      <transition name="modal">
        <div class="modal" v-if="showBody" @transitionend="onBodyTransitionEnd">
          <div class="header">
            <slot name="header"></slot>
            <div class="x-button" @click="onXClicked">X</div>
          </div>
          <div class="body">
            <slot name="body"></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'TModal',
  props: {
    show: Boolean
  },
  data () {
    return {
      showBody: false,
      showLayout: false
    }
  },
  watch: {
    show (nv) {
      if (nv) {
        this.showLayout = true
      } else {
        this.showBody = false
      }
    }
  },
  methods: {
    onXClicked () {
      this.$emit('close-me')
    },
    onTransitionEnd () {
      this.showBody = true
    },
    onBodyTransitionEnd () {
      if (!this.show) {
        this.showLayout = false
      }
    }
  }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
.layout
  width: 100vw
  height: 100vh
  background: rgba(0, 0, 0, .5)
  position: absolute
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
.modal
  background: white
  min-width: 400px
  min-height: 300px
  border-radius: $border-radius
  box-shadow: 0 5px 20px rgba(0, 0, 0, .2)
  display: flex
  flex-direction: column

.header
  flex-basis: 50px
  border-bottom: 1px solid $border-light
  display: flex
  justify-content: space-between
.footer
  flex-basis: 50px
  border-top: 1px solid $border-light
  display: flex
  justify-content: flex-end
  align-items: center
  padding 0 1rem
  gap: 1rem
.body
  flex-grow: 1
  display: flex
  align-items: center
  justify-content: center
  padding: 1rem
.x-button
  flex-basis: 50px
  height: 50px
  display: flex
  justify-content: center
  align-items: center
  align-self: stretch
  font-size: 1.4rem
  cursor: pointer
  transition: background-color .3s ease
.x-button:hover
  background: $bg-light

.modal-enter-from, .modal-leave-to
  transform: translateY(-200px)
.modal-enter-to, .modal-leave-from
  transform: translateY(0)
.modal-enter-active, .modal-leave-active
  transition: transform .5s ease
  transform-origin: top

.modal-layout-enter-from, .modal-layout-leave-to
  opacity: 0
.modal-layout-enter-to, .modal-layout-leave-from
  opacity: 1
.modal-layout-enter-active, .modal-layout-leave-active
  transition: opacity .3s ease


</style>