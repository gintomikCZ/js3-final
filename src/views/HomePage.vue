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
        :month="month"
        :year="year"
        :end-days="endDays"
        @month-plus="monthPlus"
        @month-minus="monthMinus"
        @year-plus="year++"
        @year-minus="year--"
      />
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
      loading: true,
      month: 0,
      year: 0
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
    const today = new Date()
    this.month = today.getMonth()
    this.year = today.getFullYear()
    Promise.all(
      [
        this.$store.dispatch('fetchPersons'),
        this.$store.dispatch('fetchTasks')
      ]
    ).then(() => {
      this.loading = false
    })
  },
  methods: {
    monthPlus () {
      if(this.month === 11) {
        this.month = 0
        this.year++
      } else {
        this.month++
      }
    },
    monthMinus () {
      if(this.month === 0) {
        this.month = 11
        this.year--
      } else {
        this.month--
      }
    }
  },
  components: { TCalendar, TLoading }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.statistics
  align-self: flex-start
  margin-top: 4rem
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