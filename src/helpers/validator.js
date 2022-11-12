
import db from './db.js'


export default {

  required (value) {
    return Promise.resolve().then(() => {
      return value === 0 || !!value
    })
  },

  maxLength (value, par) {
    return Promise.resolve().then(() => {
      return (typeof value === 'string') && value.length <= par
    })
  },

  minLength (value, par) {
    return Promise.resolve().then(() => {
      return (typeof value === 'string') && value.length >= par
    })
  },

  async isUnique (value, par) {
    const data = await db.get(par.table + '?' + par.column + '=' + value)
    return !data.length
    // return !data.some(record => {
    //   return '' + record[par.column].toLowerCase() === value.toLowerCase()
    // })
  },

  pattern (value, par) {
    return par.test(value)
  },

  valueList (value, par) {
    return par.indexOf(value) > -1
  }
}