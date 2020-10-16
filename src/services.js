const { get } = require('axios')

const genericRestCall = (id, logger) => {
  return get(`https://ghibliapi.herokuapp.com/films/${id}`, { timeout: 1000 })
    .then(({ data }) => {
      logger.info('genericRestCall success')
      return data
    })
    .catch((err) => {
      logger.error(err, 'genericRestCall failed!')
      throw new Error('it broke!')
    })
}
module.exports = {
  genericRestCall,
}
