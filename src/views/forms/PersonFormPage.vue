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
      db.post('js3persons', payload).then(id => { // nejdříve ukládáme form. data (payload) bez souborů, protože potřebujeme dostat nové id
        const promises = []
        const editObject = { id } // už máme nové id a můžeme s ním pracovat
        if (pictureInput.files.length) { // pokud je vložen obrázek
          const formData = new FormData()
          formData.set('file', pictureInput.files[0])
          promises.push( // ukládáme ukládací promisu na obrázek
            db.post('file/' + id, formData).then(() => {
              let pictureExt = pictureInput.files[0].type.split('/')[1]
              if (pictureExt === 'jpeg') pictureExt = 'jpg'
              editObject.picture = id + '.' + pictureExt // a současně do objektu ukládáme název obrázku
            })
          )
        }
        if (cvInput.files.length) { // pokud je vložen cv
          const formData1 = new FormData()
          formData1.set('file', cvInput.files[0])
          promises.push(   // ukládáme ukládací promisu
            db.post('file/' + id, formData1).then(() => {
              editObject.cv = id + '_cv.pdf' // a současně do objektu ukládáme název souboru cv
            })
          )
        }
        Promise.all(promises).then(() => { // pouštíme obě ukládací promisy
          if (Object.keys(editObject).length > 1) { // pokud máme v editObjektu hodnoty
            db.put('js3persons', editObject).then(() => { // pouštíme edit promisu, která uloží do db názvy těch souborů
              this.$router.push('/persons') // potom přesměrování
            })
          } else {
            this.$router.push('/persons') // v případě že nejsou hodnoty v objektu, hned přesměrováváme
          }
        })
      })
    },

    saveDataEdit (payload) {
      const pictureInput = document.getElementById('picture') // input el. obrázku
      const cvInput = document.getElementById('cv') // input el. cv
      const promAr1 = [] // sbírá promisy na mazání souborů (picture nebo cv)
      const promAr2 = [] // sbírá promisy na ukládání souborů
      if (this.pictureChanged && this.formSettings.picture.initialValue) { // pokud je změněn obrázek, ukládáme mazací promisu do prvního pole
        promAr1.push(db.post('file/delete/' + this.formSettings.picture.initialValue))
        payload.picture = ''
      }
      if (pictureInput.files.length) { // pokud je vložen nový obrázek ukládáme ukládací promisu do druhého pole
        const formData = new FormData()
        formData.set('file', pictureInput.files[0])
        let pictureExt = pictureInput.files[0].type.split('/')[1] // současně do form. dat (payload) ukládáme nový název souboru
        if (pictureExt === 'jpeg') pictureExt = 'jpg'
        payload.picture = this.$route.params.id + '.' + pictureExt
        promAr2.push(db.post('file/' + this.$route.params.id, formData))
      }
      if (this.cvChanged && this.formSettings.cv.initialValue) { // pokud je změněn cv soubor, ukládáme mazací promisu do prvního pole
        payload.cv = ''
        promAr1.push(db.post('file/delete/' + this.formSettings.cv.initialValue))
      }
      if (cvInput.files.length) { // pokud je vložen soubor cv, ukládáme ukládací promisu do druhého pole
        const formData1 = new FormData()
        formData1.set('file',cvInput.files[0])
        payload.cv = this.$route.params.id + '_cv.pdf' // současně do form. dat (payload) ukládáme nový název souboru
        promAr2.push(db.post('file/' + this.$route.params.id, formData1))
      }
      Promise.all(promAr1).then(() => { // pouštíme mazací promisy
        Promise.all(promAr2).then(() => { // po nich pouštíme ukládací promisy
          const newPayload = Object.assign({ id: this.$route.params.id }, payload) // přidáváme id k datům
          db.put('js3persons', newPayload).then(() => { // pouštíme promisu na uložení celých form. dat
            this.$router.go(-1) // přesměrováváme
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