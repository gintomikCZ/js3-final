<template>
  <div class="page">
    <h1>{{ title }}</h1>
    <t-loading v-if="loading" />
    <t-form v-else :settings="formSettings" @submited="onSubmited" />
  </div>
</template>

<script>
import TForm from '../../components/forms/TForm.vue'
import TLoading from '../../components/TLoading.vue'
import db from '../../helpers/db.js'
export default {
  name: 'PersonFormPage',
  data () {
    return {
      formSettings: {
        first: {
          type: 'text',
          initialValue: '',
          label: 'first name',
          valRules: [
            { rule: 'required', message: 'The first name is required.' },
            { rule: 'pattern', par: /^[a-zA-ZÁ-ŽáčďěíňóřšťúůýžÁČĎĚÍŇÓŘŠŤÚÝŽ -]+$/, message: 'No special characters are allowed.'}
          ]
        },
        last: {
          type: 'text',
          initialValue: '',
          label: 'last name',
          valRules: [
            { rule: 'required', message: 'The last name is required.' },
            { rule: 'pattern', par: /^[a-zA-ZÁ-ŽáčďěíňóřšťúůýžÁČĎĚÍŇÓŘŠŤÚÝŽ -]+$/, message: 'No special characters are allowed.' }
          ]
        },
        positionid: {
          type: 'select',
          initialValue: '',
          label: 'position',
          valRules: [
            { rule: 'required', message: 'The position name is required.' },
          ],
          options: []
        },
        maxlevel: {
          type: 'number',
          initialValue: '',
          label: 'max level',
          valRules: [
            { rule: 'required', message: 'The max level name is required.' },
          ]
        },
        picture: {
          type: 'text',
          initialValue: '',
          label: 'picture',
          valRules: []
        },
        cv: {
          type: 'text',
          initialValue: '',
          label: 'cv',
          valRules: []
        },
        active: {
          type: 'select',
          initialValue: '',
          label: 'active',
          valRules: [
            { rule: 'required', message: 'This field is required.' },
            { rule: 'valueList', par: ['0', '1'], message: 'This value is not allowed.' }
          ],
          options: [
            { value: '', label: '' },
            { value: '1', label: 'YES' },
            { value: '0', label: 'NO' }
          ]
        }
      },
      loading: true
    }
  },
  computed: {
    mode () {
      return this.$route.params.id ? 'edit' : 'add'
    },
    title () {
      return this.mode === 'edit' ? 'Edit person details' : 'Add new person'
    }
  },
  created () {
    const promises = [db.get('js3positions').then(
      options => {
        const optionsMapped = options.map(option => {
          return { value: option.id, label: option.position }
        })
        optionsMapped.unshift({ value: '', label: '' })
        this.formSettings.positionid.options = optionsMapped
      })
    ]
    if (this.mode === 'edit') {
      promises.push(db.get('js3persons/' + this.$route.params.id).then(
        record => {
          Object.keys(this.formSettings).forEach(control => {
            this.formSettings[control].initialValue = '' + record[control]
          })
        })
      )
    }
    Promise.all(promises).then(() => {
      this.loading = false
    })
  },
  methods: {
    onSubmited (payload) {
      const method = this.mode === 'add' ? 'post' : 'put'
      const data = this.mode === 'add' ? payload : Object.assign({ id: this.$route.params.id }, payload)
      db[method]('js3persons', data).then(() => {
        this.$router.push('/persons')
      })
    }
  },
  components: { TForm, TLoading }
}

</script>

<style lang="stylus" scoped>
.page
  display: flex
  flex-direction: column
  align-items: center

</style>