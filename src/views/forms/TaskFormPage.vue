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
  name: 'TaskFormPage',
  data () {
    return {
      formSettings: {
        task: {
          type: 'text',
          initialValue: '',
          label: 'task',
          valRules: [
            { rule: 'required', message: 'The task description is required.' },
            { rule: 'minLength', par: 2, message: 'Please enter at least 2 chars' }
          ]
        },
        projectid: {
          type: 'select',
          initialValue: '',
          label: 'project',
          valRules: [
            { rule: 'required', message: 'The project is required.' }
          ],
          options: []
        },
        level: {
          type: 'number',
          initialValue: '',
          label: 'level',
          valRules: [
            { rule: 'required', message: 'The level number is required.' },
          ],
          options: []
        },
        completed: {
          type: 'select',
          initialValue: '',
          label: 'completed',
          valRules: [
            { rule: 'required', message: 'This field is required.' },
            { rule: 'valueList', par: ['0', '1'], message: 'This value is not allowed.' }
          ],
          options: [
            { value: '', label: '' },
            { value: '1', label: 'YES' },
            { value: '0', label: 'NO' }
          ]
        },
        starts: {
          type: 'date',
          initialValue: '',
          label: 'start date',
          valRules: [
            { rule: 'required', message: 'The max level name is required.' },
          ]
        },
        ends: {
          type: 'date',
          initialValue: '',
          label: 'end date',
          valRules: [
            { rule: 'required', message: 'The max level name is required.' },
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
      return this.mode === 'edit' ? 'Edit task details' : 'Add new task'
    }
  },
  created () {
    const promises = [db.get('js3projects').then(
      options => {
        const optionsMapped = options.map(option => {
          return { value: option.id, label: option.project }
        })
        optionsMapped.unshift({ value: '', label: '' })
        this.formSettings.projectid.options = optionsMapped
      })
    ]
    if (this.mode === 'edit') {
      promises.push(db.get('js3tasks/' + this.$route.params.id).then(
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
      db[method]('js3tasks', data).then(() => {
        this.$router.push('/tasks')
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