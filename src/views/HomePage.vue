<template>
<h1>Home</h1>
<div class="container">
  <div class="statistics"></div>
  <t-calendar :month="7" :year="2022" />
  <t-modal :show="show" @close-me="show = false">
    <template v-slot:header>
      <div>header</div>
    </template>
    <template v-slot:body>
      <div>body</div>
    </template>
    <template v-slot:footer>
      <div>footer</div>
    </template>
  </t-modal>
</div>
<div>
  <button @click="show=!show">modal</button>
</div>

</template>

<script>
import TCalendar from '../components/TCalendar.vue'
import TModal from '../components/TModal.vue'

export default {
  name: 'HomePage',
  data() {
    return {
      show: false
    }
  },
  components: { TCalendar, TModal }
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