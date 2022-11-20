<template>
  <t-page :title="title" :loading="loading">
    <template v-slot:content>

      <t-modal :show="showTaskModal" @close-me="showTaskModal = false">
        <template v-slot:header>
          <h2>choose a task</h2>
        </template>
        <template v-slot:body>
          <t-task-list
            :tasks="availableTasks"
            clickable
            :highlighted-tasks="tasksToSave"
            @clicked="onAddTaskItemClicked"/>
        </template>
        <template v-slot:footer>
          <t-button label="OK" @clicked="onAddTasksOkClicked" />
        </template>
      </t-modal>

      <t-modal :show="showNoDeleteModal" @close-me="showNoDeleteModal = false">
        <template v-slot:header>
          <h2>can't be deleted</h2>
        </template>
        <template v-slot:body>
          <p>This record can not be deleted, there are tasks assigned to it in the database.</p>
        </template>
        <template v-slot:footer>
          <t-button label="OK" @clicked="showNoDeleteModal = false"/>
        </template>
      </t-modal>

      <t-modal :show="showDeleteModal" @close-me="showDeleteModal = false">
        <template v-slot:header>
          <h2>confirm delete</h2>
        </template>
        <template v-slot:body>
          <p>
            <span>do you really want to delete </span>
            <strong>{{ person.last + ' ' + person.first }}</strong>
            <span> ?</span>
          </p>
        </template>
        <template v-slot:footer>
            <t-button label="delete" @clicked="deletePerson"/>
            <t-button label="cancel" @clicked="showDeleteModal = false"/>
        </template>
      </t-modal>
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
import TModal from '../components/TModal.vue'
import db from '../helpers/db.js'

export default {
  name: 'PersonDetailPage',
  data () {
    return {
      loading: true,
      taskListShow: false,
      showDeleteModal: false,
      showNoDeleteModal: false,
      showTaskModal: false,
      tasksToSave: []
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
    },
    allTasks () {
      return [...Object.values(this.$store.state.tasks)]
    },
    availableTasks () {
      return this.allTasks.filter(task => this.person.tasks.every(item => item.taskid !== task.id))
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
      if (this.person.totalTasks) {
        this.showNoDeleteModal = true
      } else {
        this.showDeleteModal = true
      }
    },
    deletePerson () {
      const promises = []
      if (this.person.cv) {
        promises.push(
          db.post('file/delete/' + this.person.cv)
        )
      }
      if (this.person.picture) {
        promises.push(
          db.post('file/delete/' + this.person.picture)
        )
      }
      Promise.all(promises).then(() => {
        db.delete('js3persons', { id: this.personid }).then(() => {
          this.$router.push('/persons')
        })
      })
    },
    onAddTaskClicked () {
      this.$store.dispatch('fetchTasks').then(() => {
        this.showTaskModal = true
      })
    },
    onToggleMe () {
      this.taskListShow = !this.taskListShow
    },
    onAddTaskItemClicked (id) {
      // zapsat id vybraného tasku do nějakého pole
      // pokud už tam task je, tak ho odebrat
      // graficky zvýraznit už vybraný záznam, nebo oddělat zvýraznění
      if (this.tasksToSave.indexOf(id) < 0) {
        this.tasksToSave.push(id)
      } else {
        this.tasksToSave = this.tasksToSave.filter(item => item !== id)
      }
    },
    onAddTasksOkClicked () {
      // vycházíme z pole tasksToSave
      // za všech prvků toho pole vytvoříme nové záznamy v tabulce js3personstasks
      // vymazat to pole tasksToSave
      const promises = this.tasksToSave.map((taskid) => {
        return db.post('js3personstasks', { personid: this.personid, taskid })
      })
      Promise.all(promises).then(() => {
        this.$store.dispatch('fetchPersonTasks', { personid: this.personid, detail: true }).then(() => {
          this.tasksToSave = []
          this.showTaskModal = false
        })
      })

    }
  },
  components: { TPage, TButton, TAccordion, TTaskList, TModal }
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
  h2
    margin: 0
    padding-left: 1rem
    align-self: center
</style>