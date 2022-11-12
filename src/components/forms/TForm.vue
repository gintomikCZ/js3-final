<template>
  <form autocomplete="off" @submit.prevent="onSubmit">
    <t-control
      v-for="control in controls"
      :key="control"
      :settings="settings[control]"
      :control="control"
      :error="formData[control].error"
      :errorMessage="formData[control].errorMessage"
      @changed="onChanged"
      @blured="onBlured"
    />
    <div>
      <t-button :label="submitBtnText"/>
    </div>
  </form>
</template>


<script>
import TControl from './TControl.vue'
import validator from '../../helpers/validator.js'
import TButton from '../TButton.vue'
export default {
  name: 'TForm',
  props: {
    settings: {
      type: Object
    },
    submitBtnText: {
      type: String,
      default: 'submit'
    }
  },
  data () {
    return {
      formData: {}
    }
  },
  computed: {
    controls () {
      return Object.keys(this.settings)
    }
  },
  created () {
    this.controls.forEach(control => {
      this.formData[control] = {
        value: this.settings[control].initialValue || '',
        error: false,
        errorMessage: ''
      }
    })
  },
  methods: {
    validate (control) {
      const promises = this.settings[control].valRules.map(rule => {
        return validator[rule.rule](this.formData[control].value, rule.par)
      })
      return Promise.all(promises).then(result => {
        if (result.every(item => item)) {
          this.formData[control].error = false
          this.formData[control].errorMessage = ''
        } else {
          const index = result.indexOf(false)
          this.formData[control].error = true
          this.formData[control].errorMessage = this.settings[control].valRules[index].message
        }
      })
    },
    onSubmit () {
      Promise.all(this.controls.map(control => this.validate(control))).then(() => {
        console.log(this.formData)
        if (this.controls.every(control => !this.formData[control].error)) {
          this.$emit('submited', this.controls.reduce((acc, cur) => {
            acc[cur] = this.formData[cur].value
            return acc
          }, {}))
        }
      })
    },
    onChanged (payload) {
      this.formData[payload.control].value = payload.value.trim()
    },
    onBlured (control) {
      this.validate(control)
    }
  },
  components: { TControl, TButton }

}

</script>