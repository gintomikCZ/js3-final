<template>
  <div class="calendar">
    <!-- <div
      v-for="(day, index) in days" :key="index" class="calendar-day">{{ day.getDate() }}</div>
  </div> -->
    <t-calendar-day
      v-for="(day, index) in days"
      :key="index"
      :day="day"
      :is-current-month="day.date.getMonth() === month"
    />
  </div>
</template>


<script>

import { getNumberOfDays, getDateString } from '../helpers/dateFunctions.js'
import TCalendarDay from './TCalendarDay.vue'

export default {
  name: 'TCalendar',
  props: {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    endDays: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    days () {
      const numberOfDays = getNumberOfDays(this.month, this.year)
      const ar = []
      for (let i = 1; i <= numberOfDays; i++) {
        const dt = new Date(this.year, this.month, i)
        ar.push(
          {
            date: dt,
            isEndDay: this.endDays.indexOf(this.getDateString(dt)) > -1
          }
        )
      }
      let lastDay = ar[ar.length - 1].date.getDay()
      if (lastDay === 0) {
        lastDay = 7
      }
      for (let i = 1; i <= 7 - lastDay; i++) {
        const dt = new Date(this.year, this.month, numberOfDays + i)
        ar.push(
          {
            date: dt,
            isEndDay: this.endDays.indexOf(this.getDateString(dt)) > -1
          }
        )
      }
      let firstDay = ar[0].date.getDay()
      if (firstDay === 0) {
        firstDay = 7
      }
      for (let i = 1; i < firstDay; i++) {
        const dt = new Date(this.year, this.month, 1 - i)
        ar.unshift(
          {
            date: dt,
            isEndDay: this.endDays.indexOf(this.getDateString(dt)) > -1
          }
        )
      }
      return ar
    },
    numberOfWeeks () {
      return this.days.length / 7
    },
    weeks () {
      let weeks = []
      for (let i = 1; i <= this.numberOfWeeks; i++) {
        const portion = this.days.slice(7 * (i - 1), 7 * (i - 1) + 7)
        weeks.push(portion)
      }
      return weeks
    }
  },
  created () {
    setTimeout(() => {
      console.log(this.days)
    }, 1000)
  },
  methods: {
    getDateString (value) {
      console.log(getDateString(value))
      return getDateString(value)
    }
  },
  components: { TCalendarDay }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.calendar
  border: 1px solid $border-light
  border-radius: $border-radius
  display: grid
  grid-template-columns: repeat(7, 1fr)



</style>