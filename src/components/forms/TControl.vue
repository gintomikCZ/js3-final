<template>
  <div class="form-control">
    <label :for="control">{{ settings.label }}</label>
    <select
      :id="control"
      v-if="settings.type === 'select'"
      :disabled="settings.disabled || false"
      :readonly="settings.readonly || false"
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
      v-else-if="settings.type === 'file'"
      :class="{'error': error}"
      :id="control"
      type="file"
      :accept="settings.accept"
      ref="myInput"
      @change="onChange"
      @blur="onBlur"
    />
    <input
      v-else-if="show"
      :class="{'error': error}"
      :id="control"
      :placeholder="settings.placeholder || ''"
      :type="settings.type"
      :value="value"
      :disabled="settings.disabled || false"
      :readonly="settings.readonly || false"
      ref="myInput"
      @input="onInput"
      @change="onChange"
      @blur="onBlur"
    />
    <template v-if="settings.type === 'file'">
      <div class="file-input-container">

        <img
          v-if="settings.fileType==='image' && settings.initialValue"
          :src="pictureName"
        />

        <t-button btn-type="button" label="choose a file" @clicked="onInputFileButtonClicked"/>

        <template v-if="fileName">
          <div class='file-name'>{{ fileName }}</div>
          <t-button btn-type="button" label="X" @clicked="onFileDeleteClicked"/>
        </template>

      </div>
    </template>
    <transition name="slide">
      <div v-if="error" class="error-message">{{ errorMessage }}</div>
    </transition>
  </div>
</template>

<script>
import TButton from '../TButton.vue'
export default {
  name: 'TControl',
  data () {
    return {
      value: '',
      fileName: '',
      show: true
    }
  },
  props: {
    settings: Object,
    control: String,
    error: Boolean,
    errorMessage: String
  },
  created () {
    if('initialValue' in this.settings && this.settings.type !== 'file') {
      this.value = this.settings.initialValue
    }
    if (this.settings.fileType === 'pdf' && this.settings.initialValue) {
      this.fileName = this.settings.initialValue
    }
  },
  computed: {
    pictureName () {
      if (this.settings.fileType !== 'image' || !this.settings.initialValue) {
        return ''
      }
      const ar = this.settings.initialValue.split('.')
      return 'https://sdaapi.glabazna.eu/images/' + ar[0] + '_80.' + ar[1]
    }
  },
  methods: {
    onInput (event) {
      this.value = event.target.value
    },
    onChange () {
      if (this.settings.type === 'file') {
        this.fileName = this.$refs.myInput.files[0].name
        this.$emit('blured', this.control)
      }
      this.$emit('changed', { control: this.control, value: this.value })
    },
    onBlur () {
      this.$emit('blured', this.control)
    },
    onInputFileButtonClicked () {
     this.$refs.myInput.click()
    },
    onFileDeleteClicked () {
      this.$refs.myInput.value = ''
      this.fileName = ''
    }
  },
  components: { TButton }
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

input[type="file"]
  position: absolute
  top: -5000px
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

.file-input-container
  display: flex;
  gap: 1rem;
  align-items: center;

</style>
