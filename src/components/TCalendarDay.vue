<template>

<div class="calendar-day">
  <div :class="{
    'not-this-month': !isCurrentMonth,
    'weekend-day': isWeekend
  }"
  >{{ dayNumber }}</div>
  <div v-if="day.isEndDay">
    <span>ahoj</span>
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
    }
  },
  created () {
    console.log(this.day)
  }
}

</script>

<style lang="stylus" scoped>

.calendar-day
  width: 50px
  height: 50px
  padding: .3rem
  box-shadow: inset 0px 0px 1px rgba(0, 0, 0, .3)

.not-this-month
  font-style: italic
  font-size: .8rem

.weekend-day
  font-weight: bold


</style>