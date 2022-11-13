<template>
  <t-page :title="title" :loading="loading">
    <template v-slot:content>
      <div>
        <ul>
          <li>
            <span>project name</span>
            <span>{{ project.project }}</span>
          </li>
        </ul>
      </div>
      <div class="btn-container">
        <t-button label="edit" @clicked="onEditClicked" />
        <t-button label="delete" @clicked="onDeleteClicked" />
        <t-button label="add task" @clicked="onAddTaskClicked" />
      </div>
      <div class="list-container">
        <t-accordion @toggle-me="onToggleMe" :show="taskListShow">
          <template v-slot:header>
            <div class="task-list-header">
              <span>tasks: completed/total</span>
              <span>{{ project.totalCompleted + '/' + project.totalTasks }}</span>
            </div>
          </template>
          <template v-slot:content>
            <!-- tabulka úkolů -->
            <t-task-list :tasks="project.tasks" />
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
  name: 'ProjectDetailPage',
  data () {
    return {
      loading: true,
      taskListShow: false
    }
  },
  computed: {
    projectid () {
      return this.$route.params.id
    },
    project () {
      return this.$store.state.projectDetail
    },
    title () {
      return this.project.project + ' details'
    },
  },
  created () {
    Promise.all(
      [
        this.$store.dispatch('fetchProjectDetail', this.projectid),
        this.$store.dispatch('fetchProjectTasks', { projectid: this.projectid, detail: true })
      ]
    ).then(() => {
      this.loading = false
    })
  },
  methods: {
    onEditClicked () {
      this.$router.push('/projectform/' + this.projectid)
    },
    onDeleteClicked () {
      console.log('delete clicked')
      // TODO:delete person behavior
    },
    onAddTaskClicked () {
      this.$router.push('/projecttaskform/' + this.projectid)
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
</style>