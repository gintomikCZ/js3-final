import { formatDate } from '../helpers/dateFunctions'
import db from '../helpers/db'
import { createStore } from 'vuex'

export default createStore({
  state: {
    persons: {},
    projects: {},
    tasks: {}
  },
  getters: {
  },
  mutations: {
    setPersons (state, data) {
      state.persons = {}
      data.forEach(record => {
        state.persons[record.id] = Object.assign(record, { show: false, tasks: [] })
      })
    },
    setPersonTasks (state, payload) {
      state.persons[payload.personid].tasks = payload.data
    },
    setProjectTasks (state, payload) {
      state.projects[payload.projectid].tasks = payload.data
    },
    setPersonShow (state, payload)  {
      state.persons[payload.personid].show = payload.value
    },
    setProjectShow (state, payload) {
      state.projects[payload.projectid].show = payload.value
    },
    setTaskShow (state, payload) {
      state.tasks[payload.taskid].show = payload.value
    },
    setProjects (state, data) {
      state.projects = {}
      data.forEach(record => {
        state.projects[record.id] = Object.assign(record, { show: false, tasks: [] })
      })
    },
    setTasks (state, data) {
      data.forEach(record => {
        state.tasks[record.id] = Object.assign(record, { show: false, persons: [] })
      })
    },
    setTaskPersons (state, payload) {
      state.tasks[payload.taskid].persons = payload.data
    }
  },
  actions: {
    fetchPersons (context) {
      db.get('js3persons').then(data => {
        context.commit('setPersons', data)
      })
    },
    fetchPersonTasks (context, personid) {
      db.get('js3personstasks?personid=' + personid).then(data => {
        context.commit('setPersonTasks', { personid, data: data.map (item => {
          return Object.assign(item, { startsFormated: formatDate(item.starts), endsFormated: formatDate(item.ends) })
        }) })
      })
    },
    fetchTaskPersons (context, taskid) {
      db.get('js3personstasks?taskid=' + taskid).then(data => {
        context.commit('setTaskPersons', { taskid, data })
      })
    },
    fetchProjects (context) {
      db.get('js3projects').then(data => {
        context.commit('setProjects', data)
      })
    },
    fetchProjectTasks (context, projectid) {
      db.get('js3tasks?projectid=' + projectid).then(data => {
        context.commit('setProjectTasks', {
          projectid, data: data.map(item => {
            return Object.assign(item, { startsFormated: formatDate(item.starts), endsFormated: formatDate(item.ends) })
          })
        })
      })
    },
    fetchTasks (context) {
      db.get('js3tasks').then(data => {
        context.commit('setTasks', data)
      })
    }
  },
  modules: {
  }
})

/*

'persons?first=Karel&last=Houska' => [{.....}]
'persons/2' => { first: 'Karel' ....}

state.persons = {
  2: {
    first: 'Karel',
    last: 'Houska,
    show: false,
    tasks: [
      { id: 1, taskid: 1, personid: 2, first: Karel, last: Houska, task: vokopat zahradu, starts: '2022-09-13'}
      { id: 2, taskid: 1, personid: 2, first: Karel, last: Houska, task: vokopat zahradu, starts: '2022-09-13'}
    ],
    userLastModified,
    timeLastModified
  }
}

*/
