<template>
  <t-page title="persons" :loading="loading">
    <template v-slot:btn>
      <t-button label="add new person" @clicked="onClicked"/>
    </template>
    <template v-slot:content>
      <t-accordion
        v-for="personid in personskeys"
        :key="'person' + personid"
        @toggle-me="onToggleMe(personid, $event)"
        :show="persons[personid].show"
      >
        <template v-slot:header>
          <div class="person-label">
            <div>{{ persons[personid].last + ' ' + persons[personid].first }}</div>
            <div :ref="'links' + personid">
              <!-- TODO: add router links -->
              <router-link :to="'/persondetail/' + personid">detail</router-link>
              <router-link :to="'/personform/' + personid">edit</router-link>
              <router-link to="#">add task</router-link>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <t-task-list :tasks="persons[personid].tasks"/>
        </template>
      </t-accordion>
    </template>
  </t-page>

</template>

<script>
import TAccordion from '../components/TAccordion.vue'
import TTaskList from '../components/TTaskList.vue'
import TPage from '../components/TPage.vue'
import TButton from '../components/TButton.vue'

export default {
  name: 'PersonsPage',
  data () {
    return {
      loading: true,
    }
  },
  computed: {
    persons () {
      return this.$store.state.persons
    },
    /*
      [
        {id: 1, first: Karel, last: houska }
        {id: 2, first: Karel, last: houska }
        {id: 3, first: Karel, last: houska }
        {id: 4, first: Karel, last: houska }
      ]

      {
        '1': {id: 1, first: Karel, last: houska },
        '2':  {id: 2, first: Karel, last: houska }
      }


    */
    personskeys () {
      return Object.keys(this.persons).sort((a, b) => { // [1, 5, 8, 9]
        const aFullName = this.persons[a].last + ' ' + this.persons[a].first
        const bFullName = this.persons[b].last + ' ' + this.persons[b].first
        return aFullName.localeCompare(bFullName)
      })
    }
  },
  created () {
    this.$store.dispatch('fetchPersons').then(this.loading = false)
  },
  methods: {
    onToggleMe (personid, $event) {
      const linksEl = this.$refs['links' + personid][0]
      if (linksEl.contains($event.target)) {
        return
      }
      if (this.persons[personid].show) {
        this.$store.commit('setPersonShow', { personid, value: false })
        return
      }
      this.$store.dispatch('fetchPersonTasks', { personid: personid, detail: false }).then(() => {
        this.$store.commit('setPersonShow', { personid, value: true })
      })
    },
    onClicked () {
      this.$router.push('/personform')
    }
  },
  components: { TAccordion, TTaskList, TPage, TButton }
}

</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'
.person-label
  display: flex
  justify-content: space-between
  border-bottom: 1px solid $border-light
  padding: $list-padding
  & > div:first-child
    font-weight: bold

a
  text-decoration: none
  color: $text-color
  padding: .2em
  transition: background-color .3s ease
  font-size: .8rem
  &:not(:last-child)
    margin-right: 1rem
  &:hover
    background: white
</style>