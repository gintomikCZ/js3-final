<template>
  <nav ref="myNav">
    <ul>
      <li>
        <router-link to="/home" :class="{
          'link-active': ['/', '/home'].indexOf($route.path) > -1
        }">Home</router-link>
      </li>
      <li>
        <router-link to="/projects"
          :class="{
            'link-active': $route.path === '/projects'
          }">Projects</router-link>
      </li>
      <li>
        <router-link to="/tasks"
          :class="{
            'link-active': $route.path === '/tasks'
          }">Tasks</router-link>
      </li>
      <li>
        <router-link to="/persons"
          :class="{
            'link-active': $route.path === '/persons'
          }">Persons</router-link>
      </li>
    </ul>
  </nav>
</template>


<script>

export default {
  name: 'TNavBar',
  mounted () {
    const rect = this.$refs.myNav.getBoundingClientRect()
    console.log(rect)
    console.log(window.innerWidth)
  }
}


</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

ul
  list-style-type: none
  display: flex
  justify-content: space-between
  background: $primary
  margin: 0
  padding: 0 2rem
  & li
    padding: 1rem

a
  text-decoration: none
  color: $text-secondary
  font-weight: bold
  position: relative
  &::after
    content: ''
    height: 2px
    width: 100%
    background: $text-secondary
    transition: transform .3s ease
    transform: scaleX(0)
    position: absolute
    top: 100%
    left: 0
    transform-origin: left
  &:hover::after, &.link-active::after
    transform: scaleX(1)


</style>