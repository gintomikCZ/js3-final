import { formatDate } from '../helpers/dateFunctions'
import db from '../helpers/db'
import { createStore } from 'vuex'

export default createStore({
  state: {
    persons: {},
    projects: {},
    tasks: {},
    personDetail: {},
    projectDetail: {},
    taskDetail: {},
    width: 0,
    height: 0
  },
  getters: {
  },
  mutations: {
    setReload (state, value) {
      state.reload = value
    },
    setPersons (state, data) {
      state.persons = {}
      data.forEach(record => {
        state.persons[record.id] = Object.assign(record, { show: false, tasks: [] })
      })
    },
    setPersonTasks (state, payload) {
      if (payload.detail) {
        state.personDetail = Object.assign(state.personDetail, {
          tasks: payload.data,
          totalTasks: payload.data.length,
          totalCompleted: payload.data.filter(item => '' + item.completed === '1').length
        })
      } else {
        state.persons[payload.personid].tasks = payload.data
      }
    },
    setProjectTasks (state, payload) {
      if (payload.detail) {
        state.projectDetail = Object.assign(state.projectDetail, {
          tasks: payload.data,
          totalTasks: payload.data.length,
          totalCompleted: payload.data.filter(item => '' + item.completed === '1').length
        })
      } else {
        state.projects[payload.projectid].tasks = payload.data
      }
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
      state.tasks = {}
      data.forEach(record => {
        state.tasks[record.id] = Object.assign(record, { show: false, persons: [] })
      })
    },
    setTaskPersons (state, payload) {
      if (payload.detail) {
        state.taskDetail = Object.assign(state.taskDetail, {
          persons: payload.data,
          totalPersons: payload.data.length
        })
      } else {
        state.tasks[payload.taskid].persons = payload.data
      }
    },
    setPersonDetail (state, record) {
      state.personDetail = Object.assign({}, record)
    },
    setProjectDetail (state, record) {
      state.projectDetail = Object.assign(state.projectDetail, record)
    },
    setTaskDetail (state, record) {
      state.taskDetail = Object.assign(state.taskDetail, record)
    },
    setWindow (state) {
      state.width = window.innerWidth
      state.height = window.innerHeight
    }
  },
  actions: {
    fetchPersons (context) {
      db.get('js3persons').then(data => {
        context.commit('setPersons', data)
      })
    },
    fetchPersonTasks (context, payload) {
      db.get('js3personstasks?personid=' + payload.personid).then(data => {
        context.commit('setPersonTasks', {
          personid: payload.personid,
          detail: payload.detail,
          data: data.map (item => {
            return Object.assign(item, { startsFormated: formatDate(item.starts), endsFormated: formatDate(item.ends) })
          })
        })
      })
    },
    fetchTaskPersons (context, payload) {
      db.get('js3personstasks?taskid=' + payload.taskid).then(data => {
        context.commit('setTaskPersons', {
          taskid: payload.taskid,
          detail: payload.detail,
          data
        })
      })
    },
    fetchProjects (context) {
      db.get('js3projects').then(data => {
        context.commit('setProjects', data)
      })
    },
    fetchProjectTasks (context, payload) {
      db.get('js3tasks?projectid=' + payload.projectid).then(data => {
        context.commit('setProjectTasks', {
          projectid: payload.projectid,
          detail: payload.detail,
          data: data.map(item => {
            return Object.assign(item, { startsFormated: formatDate(item.starts), endsFormated: formatDate(item.ends) })
          })
        })
      })
    },
    fetchTasks (context) {
      db.get('js3tasks').then(data => {

        context.commit('setTasks', data.map(item => {
          return Object.assign(item, { startsFormated: formatDate(item.starts), endsFormated: formatDate(item.ends) })
        }))
      })
    },
    fetchPersonDetail (context, id) {
      db.get('/js3persons/' + id).then((record) => {
        context.commit('setPersonDetail', record)
      })
    },
    fetchProjectDetail (context, id) {
      db.get('/js3projects/' + id).then((record) => {
        context.commit('setProjectDetail', record)
      })
    },
    fetchTaskDetail (context, id) {
      db.get('js3tasks/' + id).then((record) => {
        context.commit(
          'setTaskDetail',
          Object.assign(
            record,
            { startsFormated: formatDate(record.starts), endsFormated: formatDate(record.ends) }
          )
        )
      })
    },
    // fetchSynchronous (context) {
    //   return new Promise (resolve => {
    //     setTimeout(() => {
    //       context.commit('saveData', data)
    //       resolve()
    //     }, 1000)
    //   })
    // }
    // thenable
  },
  modules: {

  }
})
