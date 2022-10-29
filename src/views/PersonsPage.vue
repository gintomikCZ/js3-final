<template>
  <div class="page">
    <h1>Persons</h1>
    <t-loading v-if="loading" />
    <div v-else class="page-container">

      <t-accordion
        v-for="personid in personskeys"
        :key="'person' + personid"
        @toggle-me="onToggleMe(personid)"
        :show="persons[personid].show"
      >
        <template v-slot:header>
          <div class="person-label">
            <div>{{ persons[personid].last + ' ' + persons[personid].first }}</div>
            <div>
              <!-- TODO: add router links -->
              <router-link to="#">detail</router-link>
              <router-link to="#">edit</router-link>
              <router-link to="#">add task</router-link>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <t-task-list :tasks="persons[personid].tasks"/>
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
  name: 'PersonsPage',
  data () {
    return {
      loading: true,
      showPersons: []
    }
  },
  computed: {
    persons () {
      return this.$store.state.persons
    },
    personskeys () {
      return Object.keys(this.persons).sort((a, b) => {
        const aFullName = this.persons[a].last + ' ' + this.persons[a].first
        const bFullName = this.persons[b].last + ' ' + this.persons[b].first
        return aFullName.localeCompare(bFullName)
      })
    }
  },
  created () {
    this.$store.dispatch('fetchPersons').then(this.loading = false)
  },
  methods: {
    onToggleMe (personid) {
      if (this.persons[personid].show) {
        this.$store.commit('setPersonShow', { personid, value: false })
        return
      }
      this.$store.dispatch('fetchPersonTasks', personid).then(() => {
        this.$store.commit('setPersonShow', { personid, value: true })
      })
    }
  },
  components: { TAccordion, TLoading, TTaskList }
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


.person-label
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