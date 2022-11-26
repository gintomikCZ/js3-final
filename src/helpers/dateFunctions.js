export const getNumberOfDays = function (month, year) {
  const lastDayOfMonth = new Date(year, month + 1, 0)
  return lastDayOfMonth.getDate()
}

export const formatDate = function (dateString) {
  if (typeof dateString !== 'string') {
    throw new Error('formatDate - the parameter must be a string!')
  }
  const ar = dateString.split('-')
  return ar[2] + '.' + ar[1] + '.' + ar[0]

}

export const getDateString = function (dt) {
  const month = dt.getMonth() + 1
  const monthToDisplay =  month < 10 ? '0' + month : '' + month
  const date = dt.getDate()
  const dateToDisplay = date < 10 ? '0' + date : '' + date
  return '' + dt.getFullYear() + '-' + monthToDisplay + '-' + dateToDisplay
}