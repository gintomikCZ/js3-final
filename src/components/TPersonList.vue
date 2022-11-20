<template>
  <div class="person-list-content">
    <ul>
      <li
        v-for="person in persons"
        :key="'person' + person.id"
        :class="{
          'clickable': clickable,
          'highlighted': highlightedPersons.indexOf(person.id) > -1
        }"
        @click="onClick(person.id)"
      >
        <span>{{ person.last + ' ' + person.first }}</span>
        <span>{{ ', ' + person.position }}</span>
      </li>
    </ul>
  </div>
</template>


<script>

export default {
  name: 'TPersonList',
  props: {
    persons: Array,
    clickable: {
      type: Boolean,
      default: false
    },
    highlightedPersons: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onClick(personid) {
      this.$emit('clicked', personid)
    }
  }
}


</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.person-list-content
  padding: .4em .8em

ul
  list-style-type: none
  padding: 0
  margin: 0
ul > li
  padding: .35em 0
  &:not(:last-child)
    border-bottom: 1px solid $border-light

ul > li > span:first-child
  font-weight: bold
.clickable
  cursor: pointer
  transition: background-color .3s ease
  &:hover
    background: $bg-hover

.highlighted
  background: $bg-highlight
</style>
