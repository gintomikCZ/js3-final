<template>
  <keep-alive>
    <t-nav-bar />
  </keep-alive>
  <router-view/>
</template>

<script>

import TNavBar from './components/TNavBar.vue'

export default {

  name: 'App',
  mounted () {
    this.$store.commit('setWindow')
    window.addEventListener('resize', () => {
      this.$store.commit('setWindow')
    })
  },
  components: { TNavBar }

}

</script>

<style lang="stylus">
#lalala
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

body
  margin: 0
  padding: 0


</style>
