<template>
  <div>
    <div class="calendar-header">
      <!-- << -->
      <div class="arrows">
        <t-button label="<<" @clicked="$emit('year-minus')" />
        <!-- < -->
        <t-button label="<" @clicked="$emit('month-minus')"/>
      </div>
      <!-- November 2022 -->
      <h2>{{ title }}</h2>
      <!-- >> -->
      <div class="arrows">
        <t-button label=">" @clicked="$emit('month-plus')"/>
        <!-- > -->
        <t-button label=">>" @clicked="$emit('year-plus')"/>
      </div>
    </div>
    <div class="calendar">
      <t-calendar-day
        v-for="(day, index) in days"
        :key="index"
        :day="day"
        :is-current-month="day.date.getMonth() === month"
      />
    </div>
  </div>
</template>


<script>

import { getNumberOfDays, getDateString, getMonthName } from '../helpers/dateFunctions.js'
import TCalendarDay from './TCalendarDay.vue'
import TButton from './TButton.vue'

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
    },
    title () {
      return getMonthName(new Date(this.year, this.month, 1)) + ' ' + this.year
    }
  },
  methods: {
    getDateString (value) {
      return getDateString(value)
    }
  },
  components: { TCalendarDay, TButton }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.calendar
  border: 1px solid $border-light
  border-radius: $border-radius
  display: grid
  grid-template-columns: repeat(7, 1fr)

.calendar-header
  display: flex
  align-items: center
  justify-content: space-between

.arrows
  display: flex
  gap: .5rem
</style>