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