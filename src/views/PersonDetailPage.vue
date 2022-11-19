<template>
  <t-page :title="title" :loading="loading">
    <template v-slot:content>
      <div>
        <img v-if="pictureFile" :src="pictureFile"/>
        <ul>
          <li v-for="item in personToDisplay" :key="item.label">
            <span>{{ item.label }}</span>
            <template v-if="item.label === 'cv' && item.value">
              <a :href="'https://sdaapi.glabazna.eu/images/' + item.value" target="_blank">
                <span>open file</span>
              </a>
            </template>
            <span v-else>{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="btn-container">
        <t-button label="edit" @clicked="onEditClicked"/>
        <t-button label="delete" @clicked="onDeleteClicked"/>
        <t-button label="add task" @clicked="onAddTaskClicked"/>
      </div>
      <div class="list-container">
        <t-accordion @toggle-me="onToggleMe" :show="taskListShow">
          <template v-slot:header>
            <div class="task-list-header">
              <span>tasks: completed/total</span>
              <span>{{ person.totalCompleted + '/' + person.totalTasks }}</span>
            </div>
          </template>
          <template v-slot:content>
            <t-task-list :tasks="person.tasks" />
          </template>
        </t-accordion>
      </div>
    </template>
  </t-page>

</template>

<script>

import TPage from '../components/TPage.vue'
import TButton from '../components/TButton.vue'
import TAccordion from '../components/TAccordion.vue'
import TTaskList from '../components/TTaskList.vue'

export default {
  name: 'PersonDetailPage',
  data () {
    return {
      loading: true,
      taskListShow: false
    }
  },
  computed: {
    personid () {
      return this.$route.params.id
    },
    person () {
      return this.loading ? {} : this.$store.state.personDetail
    },
    pictureFile () {
      if (!this.person.picture) {
        return ''
      }
      const ar = this.person.picture.split('.')
      return 'https://sdaapi.glabazna.eu/images/' + ar[0] + '_200.' + ar[1]
    },
    title () {
      return !this.person.last || !this.person.first ? '' : this.person.last + ' ' + this.person.first + ' details'
    },
    personToDisplay () {
      return this.loading
        ? []
        : [
          { label: 'first name', value: this.person.first },
          { label: 'last name', value: this.person.last },
          { label: 'position', value: this.person.position },
          { label: 'max level', value: this.person.maxlevel },
          { label: 'active', value: this.person.active === '1' ? 'YES' : 'NO' },
          { label: 'cv', value: this.person.cv }
        ]
    }
  },
  created () {
    Promise.all(
      [
        this.$store.dispatch('fetchPersonDetail', this.personid),
        this.$store.dispatch('fetchPersonTasks', { personid: this.personid, detail: true })
      ]
    ).then(() => {
        this.loading = false
    })
  },
  methods: {
    onEditClicked () {
      this.$router.push('/personform/' + this.personid)
    },
    onDeleteClicked () {
      console.log('delete clicked')
      // TODO:delete person behavior
    },
    onAddTaskClicked () {
      console.log('add task clicked')
      // TODO:add task to person behavior
    },
    onToggleMe () {
      this.taskListShow = !this.taskListShow
    }
  },
  components: { TPage, TButton, TAccordion, TTaskList }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
  ul
    list-style-type: none
    padding: 0
    margin: 0
    border: 1px solid $border
    border-radius: $border-radius
    & li
      padding: .4em .8em
      display: flex
      justify-content: space-between
      &:not(:last-child) {
        border-bottom: 1px solid $border-light
      }
      & span:last-child
        font-weight: bold
  .btn-container
    margin-top: 2rem
    display: flex
    justify-content: center
    gap: 1rem
  .task-list-header
    display: flex
    justify-content: space-between
    padding: .4em .8em
  .list-container
    margin-top: 2rem

  img
    margin-bottom: 1rem
    border: 1px solid $border-light
    border-radius: $border-radius
    box-shadow: 5px 5px 15px rgba(0, 0, 0, .25)
  a
    cursor: pointer
    text-decoration: none
    color: $text-color
</style>