<template>
<h1>Home</h1>
<div class="container">
  <div class="statistics"></div>
  <t-calendar :month="7" :year="2022" />
</div>
</template>

<script>
import TCalendar from '../components/TCalendar.vue'

export default {
  name: 'HomePage',
  components: { TCalendar }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.statistics
  width: 300px
  height: 300px
  background: lightpink

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