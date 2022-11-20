<template>
  <t-page :title="title" :loading="loading">
    <template v-slot:content>

      <t-modal :show="showNoDeleteModal" @close-me="showNoDeleteModal = false">
        <template v-slot:header>
          <h2>can't be deleted</h2>
        </template>
        <template v-slot:body>
          <p>This task can not be deleted there are persons assigned to it.</p>
        </template>
        <template v-slot:footer>
          <t-button label="OK" @clicked="showNoDeleteModal = false" />
        </template>
      </t-modal>

      <t-modal :show="showDeleteModal" @close-me="showDeleteModal = false">
        <template v-slot:header>
          <h2>confirm delete</h2>
        </template>
        <template v-slot:body>
          <p>
            <span>do you really want to delete task </span>
            <strong>{{ task.task }}</strong>
            <span> ?</span>
          </p>
        </template>
        <template v-slot:footer>
          <t-button label="delete" @clicked="deleteTask" />
          <t-button label="cancel" @clicked="showDeleteModal = false"/>
        </template>
      </t-modal>

      <t-modal :show="showAddPersonModal" @close-me="showAddPersonModal = false">
        <template v-slot:header>
          <h2>choose a person</h2>
        </template>
        <template v-slot:body>
          <t-person-list
            :persons="availablePersons"
            clickable
            :highlighted-persons="personsToSave"
            @clicked="onAddPersonItemClicked"
          />
        </template>
        <template v-slot:footer>
          <t-button label="OK" @clicked="onAddPersonsOkClicked" />
        </template>
      </t-modal>

      <div>
        <ul>
          <li v-for="item in taskToDisplay" :key="item.label">
            <span>{{ item.label }}</span>
            <span>{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="btn-container">
        <t-button label="edit" @clicked="onEditClicked" />
        <t-button label="delete" @clicked="onDeleteClicked" />
        <t-button label="add person" @clicked="onAddPersonClicked" />
      </div>
      <div class="list-container">
        <t-accordion @toggle-me="onToggleMe" :show="taskListShow">
          <template v-slot:header>
            <div class="task-list-header">
              <span>persons:</span>
              <span>{{ task.totalPersons }}</span>
            </div>
          </template>
          <template v-slot:content>
            <!-- tabulka lidí -->
            <t-person-list :persons="task.persons" />
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
import TPersonList from '../components/TPersonList.vue'
import TModal from '../components/TModal.vue'
import db from '../helpers/db.js'

export default {
  name: 'TaskDetailPage',
  data () {
    return {
      loading: true,
      taskListShow: false,
      showNoDeleteModal: false,
      showDeleteModal: false,
      showAddPersonModal: false,
      personsToSave: []
    }
  },
  computed: {
    taskid () {
      return this.$route.params.id
    },
    task () {
      return this.$store.state.taskDetail
    },
    title () {
      return this.task.task + ' - details'
    },
    taskToDisplay () {
      return [
        { label: 'task', value: this.task.task },
        { label: 'project', value: this.task.project },
        { label: 'level', value: this.task.level },
        { label: 'completed', value: '' + this.task.completed === '1' ? 'YES' : 'NO'},
        { label: 'start date', value: this.task.startsFormated },
        { label: 'ends date', value: this.task.endsFormated }
      ]
    },
    allPersons () {
      return [...Object.values(this.$store.state.persons)]
    },
    availablePersons () {
      return this.allPersons.filter(person => this.task.persons.every(item => item.personid !== person.id))
    }
  },
  created () {
    Promise.all(
      [
        this.$store.dispatch('fetchTaskDetail', this.taskid),
        this.$store.dispatch('fetchTaskPersons', { taskid: this.taskid, detail: true })
      ]
    ).then(() => {
      this.loading = false
    })
  },
  methods: {
    onEditClicked () {
      this.$router.push('/taskform/' + this.taskid)
    },
    onDeleteClicked () {
      if(this.task.totalPersons) {
        this.showNoDeleteModal = true
      } else {
        this.showDeleteModal = true
      }
    },
    deleteTask () {
      db.delete('js3tasks/' + this.taskid).then(() => {
        this.$router.push('/tasks')
      })
    },
    onAddPersonClicked () {
      this.$store.dispatch('fetchPersons').then(() => {
        this.showAddPersonModal = true
      })
    },
    onToggleMe () {
      this.taskListShow = !this.taskListShow
    },
    onAddPersonItemClicked (id) {
      if (this.personsToSave.indexOf(id) < 0) {
        this.personsToSave.push(id)
      } else {
        this.personsToSave = this.personsToSave.filter(item => item !== id)
      }
    },
    onAddPersonsOkClicked () {
      const promises = this.personsToSave.map((personid) => {
        return db.post('js3personstasks', { personid, taskid: this.taskid })
      })
      Promise.all(promises).then(() => {
        this.$store.dispatch('fetchTaskPersons', { taskid: this.taskid, detail: true }).then(() => {
          this.personsToSave = []
          this.showAddPersonModal = false
        })
      })
    }
  },
  components: { TPage, TButton, TAccordion, TPersonList, TModal }
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
  h2
    margin: 0
    padding-left: 1rem
    align-self: center
</style>