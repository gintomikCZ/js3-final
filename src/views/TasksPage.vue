<template>
<div class="page">
  <h1>Tasks</h1>
  <t-loading v-if="loading" />
  <div v-else class="page-container">

    <t-accordion v-for="taskid in taskkeys" :key="'task' + taskid" @toggle-me="onToggleMe(taskid)"
      :show="tasks[taskid].show">
      <template v-slot:header>
        <div class="task-label">
          <div class="task-header" :class="{'task-completed': tasks[taskid].completed}">
            <div>{{ tasks[taskid].task }}</div>
            <div>{{ formatDate(tasks[taskid].starts) + ' - ' + formatDate(tasks[taskid].ends) + (tasks[taskid].completed ? ', done' : '') }}</div>
          </div>
          <div>
            <!-- TODO: add router links -->
            <router-link to="#">detail</router-link>
            <router-link to="#">edit</router-link>
            <router-link to="#">add person</router-link>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <t-person-list :persons="tasks[taskid].persons"/>
      </template>
    </t-accordion>

  </div>

</div>
</template>

<script>
import TAccordion from '../components/TAccordion.vue'
import TLoading from '../components/TLoading.vue'
import TPersonList from '../components/TPersonList.vue'
import { formatDate } from '../helpers/dateFunctions.js'
export default {
  name: 'TasksPage',
  data () {
    return {
      loading: true
    }
  },
  computed: {
    tasks () {
      return this.$store.state.tasks
    },
    taskkeys () {
      return Object.keys(this.tasks)
    }
  },
  created () {
    this.$store.dispatch('fetchTasks').then(() => {
      this.loading = false
    })
  },
  methods: {
    formatDate (value) {
      return formatDate(value)
    },
    onToggleMe (taskid) {
      if (this.tasks[taskid].show) {
        this.$store.commit('setTaskShow', { taskid, value: false })
        return
      }
      this.$store.dispatch('fetchTaskPersons', taskid).then(() => {
        this.$store.commit('setTaskShow', { taskid, value: true })
      })
    }
  },
  components: { TAccordion, TLoading, TPersonList }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.task-label
  display: flex
  justify-content: space-between
  align-items: center
  border-bottom: 1px solid $border-light
  padding: $list-padding
  & > div:first-child
    font-weight: bold

a
  text-decoration: none
  color: $text-color
  padding: .2em
  transition: background-color .3s ease
  font-size: .8rem
  &:not(:last-child)
    margin-right: 1rem
  &:hover
    background: white
.task-header
  display: flex
  flex-direction: column
  align-items: flex-start
  & > div:nth-child(2)
    font-weight: normal
    font-size: 0.9rem
.task-completed
  color: $task-completed-color
</style>