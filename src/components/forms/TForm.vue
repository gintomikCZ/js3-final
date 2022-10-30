<template>
  <form autocomplete="off">
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
  </form>
</template>


<script>
import TControl from './TControl.vue'
import validator from '../../helpers/validator.js'
export default {
  name: 'TForm',
  props: {
    settings: Object
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
      // let error = false
      // this.settings[control].valRules.forEach(valRule => {
      //   if (!error) {
      //     const result = 'par' in valRule
      //       ? validator[valRule.rule](this.formData[control].value, valRule.par)
      //       : validator[valRule.rule](this.formData[control].value)
      //     if(!result) {
      //       this.formData[control].error = true
      //       this.formData[control].errorMessage = valRule.message
      //       error = true
      //     }
      //   } // [true, true, false, true, false]
      // })
      // if (!error) {
      //   this.formData[control].error = false
      //   this.formData[control].errorMessage = ''
      // }
      const promises = this.settings[control].valRules.map(rule => {
        return validator[rule.rule](this.formData[control].value, rule.par)
      })
      Promise.all(promises).then(result => {
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

    onChanged (payload) {
      this.formData[payload.control].value = payload.value.trim()
    },
    onBlured (control) {
      this.validate(control)
    }
  },
  components: { TControl }

}

</script>