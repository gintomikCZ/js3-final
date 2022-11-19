<template>
  <div class="page">
    <h1>{{ title }}</h1>
    <t-loading v-if="loading" />
    <t-form
      v-else
      :settings="formSettings"
      @changed="onChanged"
      @submited="onSubmited" />
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
          type: 'file',
          initialValue: '',
          label: 'picture',
          accept: '.jpg,.jpeg,.gif,.png',
          fileType: 'image',
          valRules: []
        },
        cv: {
          type: 'file',
          initialValue: '',
          label: 'cv',
          fileType: 'pdf',
          accept: '.pdf',
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
      loading: true,
      pictureChanged: false,
      cvChanged: false
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
            this.formSettings[control].initialValue = record[control] === null ? '' : '' + record[control]
          })
        })
      )
    }
    Promise.all(promises).then(() => {
      this.loading = false
    })
  },
  methods: {
    saveDataAdd (payload) {
      const pictureInput = document.getElementById('picture')
      const cvInput = document.getElementById('cv')
      db.post('js3persons', payload).then(id => {
        const promises = []
        const editObject = { id }
        if (pictureInput.files.length) {
          const formData = new FormData()
          formData.set('file', pictureInput.files[0])
          promises.push(
            db.post('file/' + id, formData).then(() => {
              let pictureExt = pictureInput.files[0].type.split('/')[1]
              if (pictureExt === 'jpeg') pictureExt = 'jpg'
              editObject.picture = id + '.' + pictureExt
            })
          )
        }
        if (cvInput.files.length) {
          const formData1 = new FormData()
          formData1.set('file', cvInput.files[0])
          promises.push(
            db.post('file/' + id, formData1).then(() => {
              editObject.cv = id + '_cv.pdf'
            })
          )
        }
        Promise.all(promises).then(() => {
          if (Object.keys(editObject).length > 1) {
            db.put('js3persons', editObject).then(() => {
              this.$router.push('/persons')
            })
          } else {
            this.$router.push('/persons')
          }
        })
      })
    },

    saveDataEdit (payload) {
      const pictureInput = document.getElementById('picture')
      const cvInput = document.getElementById('cv')
      const promAr1 = []
      const promAr2 = []
      if (this.pictureChanged && this.formSettings.picture.initialValue) {
        promAr1.push(db.post('file/delete/' + this.formSettings.picture.initialValue))
        payload.picture = ''
      }
      if (pictureInput.files.length) {
        const formData = new FormData()
        formData.set('file', pictureInput.files[0])
        let pictureExt = pictureInput.files[0].type.split('/')[1]
        if (pictureExt === 'jpeg') pictureExt = 'jpg'
        payload.picture = this.$route.params.id + '.' + pictureExt
        promAr2.push(db.post('file/' + this.$route.params.id, formData))
      }
      if (this.cvChanged && this.formSettings.cv.initialValue) {
        payload.cv = ''
        promAr1.push(db.post('file/delete/' + this.formSettings.cv.initialValue))
      }
      if (cvInput.files.length) {
        const formData1 = new FormData()
        formData1.set('file',cvInput.files[0])
        payload.cv = this.$route.params.id + '_cv.pdf'
        promAr2.push(db.post('file/' + this.$route.params.id, formData1))
      }
      Promise.all(promAr1).then(() => {
        Promise.all(promAr2).then(() => {
          const newPayload = Object.assign({ id: this.$route.params.id }, payload)
          db.put('js3persons', newPayload).then(() => {
            this.$router.go(-1)
          })
        })
      })
    },
    onSubmited (payload) {
      if (this.mode === 'add') {
        this.saveDataAdd(payload)
      } else {
        this.saveDataEdit(payload)
      }
    },
    onChanged (control) {
      if (control === 'picture') {
        this.pictureChanged = true
      }
      if (control === 'cv') {
        this.cvChanged = true
      }
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