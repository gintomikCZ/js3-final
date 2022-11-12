<template>
  <div class="form-control">
    <label :for="control">{{ settings.label }}</label>
    <select
      v-if="settings.type === 'select'"
      @input="onInput"
      @change="onChange"
      @blur="onBlur"
    >
      <option
        v-for="option in settings.options"
        :key="control + option.value"
        :value="option.value"
        :selected="'' + option.value === '' + settings.initialValue"
      >
        {{ option.label }}
      </option>
    </select>
    <input
      v-else
      :class="{'error': error}"
      :id="control"
      :placeholder="settings.placeholder || ''"
      :type="settings.type"
      :value="value"
      @input="onInput"
      @change="onChange"
      @blur="onBlur"
    />
    <transition name="slide">
      <div v-if="error" class="error-message">{{ errorMessage }}</div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'TControl',
  data () {
    return {
      value: ''
    }
  },
  props: {
    settings: Object,
    control: String,
    error: Boolean,
    errorMessage: String
  },
  created () {
    if('initialValue' in this.settings) {
      this.value = this.settings.initialValue
    }
  },
  methods: {
    onInput (event) {
      this.value = event.target.value
    },
    onChange () {
      this.$emit('changed', { control: this.control, value: this.value })
    },
    onBlur () {
      this.$emit('blured', this.control)
    }
  }
}

</script>

<style lang="stylus" scoped>
@import '../../styles/variables.styl'

.form-control
  display: flex
  flex-direction: column
  align-items: flex-start
  margin-bottom: 2rem
  position: relative

label
  margin-bottom: .5rem

input, select
  padding: .4em .5em
  font-size: 1.1rem
  border: 2px solid $border-light
  transition: border-color .3s ease
  border-radius: 0
  &:focus
    outline: none
    border-color: $focus-border-color

.error
  border: 2px solid $error-color

.error-message
  font-size: 0.9rem
  color: $error-color
  position: absolute
  top: 100%

.slide-enter-from, .slide-leave-to
  opacity: 0
  transform: translateX(-50px)

.slide-enter-to, .slide-leave-from
  opacity: 1
  transform: translateX(0)

.slide-enter-active, .slide-leave-active
  transition: all .4s linear
  transform-origin: left

</style>
