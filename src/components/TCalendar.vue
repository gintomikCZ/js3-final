<template>
  <div class="calendar">
    <!-- <div
      v-for="(day, index) in days" :key="index" class="calendar-day">{{ day.getDate() }}</div>
  </div> -->
    <t-calendar-day
      v-for="(day, index) in days"
      :key="index"
      :day="day"
      :is-current-month="day.getMonth() === month"
    />
  </div>
</template>


<script>

import { getNumberOfDays } from '../helpers/dateFunctions.js'
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
    }
  },
  computed: {
    days () {
      const numberOfDays = getNumberOfDays(this.month, this.year)
      const ar = []
      for (let i = 1; i <= numberOfDays; i++) {
        ar.push(new Date(this.year, this.month, i))
      }
      let lastDay = ar[ar.length - 1].getDay()
      if (lastDay === 0) {
        lastDay = 7
      }
      for (let i = 1; i <= 7 - lastDay; i++) {
        ar.push(new Date(this.year, this.month, numberOfDays + i))
      }
      let firstDay = ar[0].getDay()
      if (firstDay === 0) {
        firstDay = 7
      }
      for (let i = 1; i < firstDay; i++) {
        ar.unshift(new Date(this.year, this.month, 1 - i))
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
  mounted () {
    console.log(this.numberOfWeeks)
    console.log(this.weeks)
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