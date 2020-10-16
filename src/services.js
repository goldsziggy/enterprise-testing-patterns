const { get } = require('axios')

const genericRestCall = (id, logger) => {
  return get(`https://ghibliapi.herokuapp.com/films/${id}`)
    .then(({ data }) => {
      logger.info('genericRestCall success')
      return data
    })
    .catch((err) => {
      logger.error('genericRestCall failed!')
      throw new Error('it broke!')
    })
}
module.exports = {
  genericRestCall,
}
