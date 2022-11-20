<template>
<div class="task-list-content">
  <ul>
    <li>
      <span>task</span>
      <span>completed</span>
      <span>start date</span>
      <span>end date</span>
    </li>
    <li
      v-for="task in tasks"
      :key="'task' + task.id"
      :class="{
        'clickable': clickable,
        'highlighted': highlightedTasks.indexOf(task.id) > -1
      }"
      @click="onClick(task.id)"
    >
      <span>{{ task.task }}</span>
      <span>{{ task.completed ? 'Yes' : 'No' }}</span>
      <span>{{ task.startsFormated }}</span>
      <span>{{ task.endsFormated }}</span>
    </li>
  </ul>
</div>
</template>


<script>

export default {
  name: 'TTaskList',
  props: {
    tasks: Array,
    clickable: {
      type: Boolean,
      default: false
    },
    highlightedTasks: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onClick (taskid) {
      if (this.clickable) {
        this.$emit('clicked', taskid)
      }
    }
  }
}


</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.task-list-content
  padding: .4em .8em

ul
  list-style-type: none
  padding: 0
  margin: 0
ul > li
  display: flex
  padding: .35em 0
  &:not(:last-child)
    border-bottom: 1px solid $border-light

ul > li > span:first-child
  width: 50%
  text-align: left;
ul > li > span:nth-child(2)
  width: 16%
  min-width: 100px
  text-align: center;
ul > li > span:not(:first-child):not(:nth-child(2))
  width: 17%
  min-width: 100px
  text-align: right

ul > li:first-child > span
  font-weight: bold

.clickable
  cursor: pointer
  transition: background-color .3s ease
  &:hover
    background: $bg-hover

.highlighted
  background: $bg-highlight

</style>