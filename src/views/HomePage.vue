<template>
<h1>Home</h1>
  <div class="container">
    <t-loading v-if="loading" />
    <template v-else>
      <div class="statistics">
        <ul>
          <li>
            <span>we have </span>
            <strong>{{ Object.keys(persons).length }}</strong>
            <span> persons in our database</span>
          </li>
          <li>
            <span>we have </span>
            <strong>{{ Object.keys(tasks).length }}</strong>
            <span> tasks in our database, </span>
            <span>number of completed tasks: </span>
            <strong>{{ Object.keys(tasks).filter((taskKey) => tasks[taskKey].completed).length}}</strong>
          </li>
        </ul>
      </div>
      <t-calendar
        :month="7"
        :year="2022"
        :end-days="endDays"/>
    </template>
  </div>

</template>

<script>
import TCalendar from '../components/TCalendar.vue'
import TLoading from '../components/TLoading.vue'

export default {
  name: 'HomePage',
  data() {
    return {
      show: false,
      loading: true
    }
  },
  computed: {
    persons () {
      return this.$store.state.persons
    },
    tasks () {
      return this.$store.state.tasks
    },
    endDays () {
      // return ['švestka', 'jablko']
      return Object.keys(this.tasks).map(taskKey => {
        return this.tasks[taskKey].ends
      })
    }
  },
  created () {
    Promise.all(
      [
        this.$store.dispatch('fetchPersons'),
        this.$store.dispatch('fetchTasks')
      ]
    ).then(() => {
      this.loading = false
    })
  },
  components: { TCalendar, TLoading }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.statistics
  width: 300px
  height: 300px
  & ul
    list-style: none
    & li
      padding: .35em .8em
      text-align: left

.container
  display: flex
  flex-direction: column
  align-items: center
  gap: 2rem

@media screen and (min-width: $breakpoint)
  .container
    flex-direction: row
    justify-content: space-evenly
    gap: 0

</style>