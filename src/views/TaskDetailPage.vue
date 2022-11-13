<template>
  <t-page :title="title" :loading="loading">
    <template v-slot:content>
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

export default {
  name: 'TaskDetailPage',
  data () {
    return {
      loading: true,
      taskListShow: false
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
      console.log('delete clicked')
      // TODO:delete person behavior
    },
    onAddPersonClicked () {
      console.log('add person clicked')
      // TODO:add person to task behavior
    },
    onToggleMe () {
      this.taskListShow = !this.taskListShow
    }
  },
  components: { TPage, TButton, TAccordion, TPersonList }
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