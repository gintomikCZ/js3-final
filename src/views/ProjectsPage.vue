<template>
  <div class="page">
    <h1>Projects</h1>
    <t-loading v-if="loading" />
    <div v-else class="page-container">
      <t-accordion
        v-for="projectid in projectKeys"
        :key="'project' + projectid"
        @toggle-me="onToggleMe(projectid)"
        :show="projects[projectid].show"
      >
        <template v-slot:header>
          <div class="project-label">
            <div>{{ projects[projectid].project }}</div>
            <div>
              <!-- TODO: add router links -->
              <router-link to="#">detail</router-link>
              <router-link to="#">edit</router-link>
              <router-link to="#">add task</router-link>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <t-task-list :tasks="projects[projectid].tasks" />
        </template>
      </t-accordion>
    </div>
  </div>
</template>

<script>
import TAccordion from '../components/TAccordion.vue'
import TLoading from '../components/TLoading.vue'
import TTaskList from '../components/TTaskList.vue'

export default {
  name: 'ProjectsPage',
  computed: {
    projects () {
      return this.$store.state.projects
    },
    projectKeys () {
      return Object.keys(this.projects)
    }
  },
  data () {
    return {
      loading: true
    }
  },
  created () {
    this.$store.dispatch('fetchProjects').then(this.loading = false)
  },
  methods: {
    onToggleMe (projectid) {
      if (this.projects[projectid].show) {
        this.$store.commit('setProjectShow', { projectid, value: false })
        return
      }
      this.$store.dispatch('fetchProjectTasks', projectid).then(() => {
        this.$store.commit('setProjectShow', { projectid, value: true })
      })
    }
  },
  components: { TLoading, TAccordion, TTaskList }
}

</script>

<style lang="stylus" scoped>

@import '../styles/variables.styl'
.page
  display: flex
  flex-direction: column
  align-items: center
.page-container
  display: flex
  flex-direction: column
  width: 80%

.project-label
  display: flex
  justify-content: space-between
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

</style>