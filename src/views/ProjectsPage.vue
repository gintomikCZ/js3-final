<template>
  <t-page title="projects" :loading=loading>
    <template v-slot:btn>
      <t-button label="add new project" @clicked="onClicked"/>
    </template>
    <template v-slot:content>
      <t-accordion
        v-for="projectid in projectKeys"
        :key="'project' + projectid"
        @toggle-me="onToggleMe(projectid, $event)"
        :show="projects[projectid].show"
      >
        <template v-slot:header>
          <div class="project-label">
            <div>{{ projects[projectid].project }}</div>
            <div :ref="'links' + projectid">
              <!-- TODO: add router links -->
              <router-link :to="'/projectdetail/' + projectid">detail</router-link>
              <router-link :to="'/projectform/' + projectid">edit</router-link>
              <router-link to="#">add task</router-link>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <t-task-list :tasks="projects[projectid].tasks"/>
        </template>
      </t-accordion>
    </template>
  </t-page>
</template>

<script>
import TAccordion from '../components/TAccordion.vue'
import TTaskList from '../components/TTaskList.vue'
import TPage from '../components/TPage.vue'
import TButton from '../components/TButton.vue'

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
    onToggleMe (projectid, $event) {
      const linksEl = this.$refs['links' + projectid][0]
      if (linksEl.contains($event.target)) {
        return
      }
      if (this.projects[projectid].show) {
        this.$store.commit('setProjectShow', { projectid, value: false })
        return
      }
      this.$store.dispatch('fetchProjectTasks',{ projectid: projectid, detail: false }).then(() => {
        this.$store.commit('setProjectShow', { projectid, value: true })
      })
    },
    onClicked () {
      this.$router.push('/projectform')
    }
  },
  components: { TAccordion, TTaskList, TPage, TButton }
}

</script>

<style lang="stylus" scoped>

@import '../styles/variables.styl'
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