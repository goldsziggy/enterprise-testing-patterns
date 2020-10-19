const { get } = require('axios')

const getAllFIlms = (logger) => {
  return get(`https://ghibliapi.herokuapp.com/films`, { timeout: 1000 })
    .then(({ data }) => {
      logger.info('getAllFIlms success')
      return data
    })
    .catch((err) => {
      logger.error(err, 'getAllFIlms failed!')
      throw err
    })
}

const getByFilmId = (id, logger) => {
  return get(`https://ghibliapi.herokuapp.com/films/${id}`, { timeout: 1000 })
    .then(({ data }) => {
      logger.info('getByFilmId success')
      return data
    })
    .catch((err) => {
      logger.error(err, 'getByFilmId failed!')
      throw err
    })
}
module.exports = {
  getAllFIlms,
  getByFilmId,
}
