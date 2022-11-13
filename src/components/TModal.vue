<template>
  <div class="layout" v-if="show">
    <div class="modal">
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
  </div>
</template>

<script>

export default {
  name: 'TModal',
  props: {
    show: Boolean
  },
  methods: {
    onXClicked () {
      this.$emit('close-me')
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
.body
  flex-grow: 1
.x-button
  flex-basis: 50px
  height: 50px
  display: flex
  justify-content: center
  align-items: center
  font-size: 1.4rem
  cursor: pointer
  transition: background-color .3s ease
.x-button:hover
  background: $bg-light


</style>