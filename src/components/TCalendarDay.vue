<template>

<div class="calendar-day">
  <div :class="{
    'not-this-month': !isCurrentMonth,
    'weekend-day': isWeekend,
    'today': isToday
  }"
  >{{ dayNumber }}</div>
  <div v-if="day.isEndDay">
    <div class="circle"></div>
  </div>
</div>

</template>

<script>

export default {
  name: 'CalendarDay',
  props: {
    day: {
      required: true
    },
    isCurrentMonth: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    dayNumber () {
      return this.day.date.getDate()
    },
    isWeekend () {
      return [0, 6].includes(this.day.date.getDay())
    },
    isToday () {
      const today = new Date()
      return today.setHours(0, 0, 0, 0) === this.day.date.setHours(0, 0, 0, 0)
    }
  }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
.calendar-day
  width: 50px
  height: 50px
  padding: .3rem
  box-shadow: inset 0px 0px 1px rgba(0, 0, 0, .3)
  position: relative

.not-this-month
  font-style: italic
  font-size: .8rem

.weekend-day
  font-weight: bold
.today
  background: $bg-today
.circle
  width: .5rem
  height: .5rem
  border-radius: 50%
  background: red
  position: absolute
  left: calc(50% - .25rem)
  bottom: 1rem

</style>