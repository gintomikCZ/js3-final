<template>
  <div class="page">
    <h1>{{ title }}</h1>
    <t-loading v-if="loading"/>
    <t-form
      v-else
      :settings="formSettings"
      @submited="onSubmited"
    />
  </div>
</template>

<script>
import TForm from '../../components/forms/TForm.vue'
import TLoading from '../../components/TLoading.vue'
import db from '../../helpers/db.js'
export default {
  name: 'ProjectFormPage',
  data () {
    return {
      formSettings: {
        project: {
          type: 'text',
          initialValue: '',
          placeholder: '',
          label: 'project',
          helpMessage: 'please enter max. 255 characters',
          valRules: [
            { rule: 'required', message: 'The project name is required.' },
            { rule: 'maxLength', par: 255, message: 'The project name can contain maximum 255 characters.' },
            { rule: 'minLength', par: 2, message: 'The project name must contain at least 2 characters.' },
            { rule: 'isUnique', par: { table: 'js3projects', column: 'project' }, message: 'this project already exists.' }
          ]
        },
      },
      loading: true
    }
  },
  computed: {
    mode () {
      return this.$route.params.id ? 'edit' : 'add'
    },
    title () {
      return this.mode === 'edit' ? 'Edit project details' : 'Add new project'
    }
  },
  created () {
    if (this.mode === 'edit') {
      db.get('js3projects/' + this.$route.params.id).then(record => {
        this.formSettings.project.initialValue = record.project
        this.loading = false
      })
    } else {
      this.loading = false
    }
  },
  methods: {
    onSubmited (payload) {
      const method = this.mode === 'add' ? 'post' : 'put'
      const data = this.mode === 'add' ? payload : Object.assign({ id: this.$route.params.id }, payload)
      db[method]('js3projects', data).then(() => {
        this.$router.push('/projects')
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