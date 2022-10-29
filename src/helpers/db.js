import axios from 'axios'
import router from '../router/index.js'
import store from '../store/index.js'

axios.defaults.baseURL = 'https://sdaapi.glabazna.eu'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common.Accept = 'json'

const checkUrl = (url) => {
  return url.substr(0, 1) === '/' ? url : '/' + url
}


export default {

  // načítá záznam(y)
  // get(players) - načte záznamy všech hráčů
  // get(players/1) - načte 1 záznam hráče s id 1
  get (path) {
    return axios({
      method: 'get',
      url: checkUrl(path),
    }).then((response) => {
      return response.data.data
    }).catch((error) => {
      console.log(error)
      store.commit('setErrorTitle', 'Error - GET method failed')
      store.commit('setErrorMessage', 'GET Error - nepodařilo se načíst data z databáze :-(')
      router.push('/error/1')
    })
  },

  post (path, body) {
    return axios({
      method: 'post',
      url: checkUrl(path),
      data: body
    }).then((response) => {
      return response.data.data
    }).catch((error) => {
      console.error(error)
      store.commit('setErrorTitle', 'Error - POST method failed')
      store.commit('setErrorMessage', 'POST Error - nepodařilo se uložit data do databáze :-(')
      router.push('/error/1')
    })
  },
  put (path, body) {
    return axios({
      method: 'put',
      url: checkUrl(path),
      data: body
    }).then((response) => {
      return response.data.data
    }).catch((error) => {
      console.error(error)
      store.commit('setErrorTitle', 'Error - PUT method failed')
      store.commit('setErrorMessage', 'PUT Error - nepodařilo se editovat záznam :-(')
      router.push('/error/1')
    })
  },
  delete (path, body) {
    return axios({
      method: 'delete',
      url: checkUrl(path),
      data: body
    }).then((response) => {
      return response.data.data
    }).catch((error) => {
      console.error(error)
      store.commit('setErrorTitle', 'Error - DELETE method failed')
      store.commit('setErrorMessage', 'DELETE Error - nepodařilo se vymazat data z databáze :-(')
      router.push('/error/1')
    })
  }

}